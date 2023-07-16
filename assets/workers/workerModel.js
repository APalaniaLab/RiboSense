import { loadLayersModel, tensor2d } from '@tensorflow/tfjs'

const models = {detector: null, classifier: null}
const loadModels = async () => {
  try {
      models.detector = models.detector == null ? await loadLayersModel("/models/detector-js/model.json") : models.detector
  } catch (e) {
      self.postMessage({
        type: 'error',
        data: "Unable to load the detector model. Annotation tool will not work."
      })
      return
  }

  try {
      models.classifier = models.classifier == null ? await loadLayersModel("/models/classifier-js/model.json") : models.classifier
  } catch (e) {
      self.postMessage({
        type: 'error',
        data: "Unable to load the classifier model. Annotation tool will not work."
      })
      return
  }
}

function character_mapping(x) {
  const mapping = {'R' : 'G', 'Y' : 'T', 'M' : 'A', 'K' : 'G', 'S' : 'G', 'W' : 'A', 'H' : 'A', 'B' : 'G', 'V' : 'G', 'D' : 'G'}

  x = x.toUpperCase()
  for (var k in mapping) {
    x = x.replace(k, mapping[k])
  }

  return x.split('')
}

function letter_to_index(letter) {
  const TOKEN_MAPPING = "ATGCN"
  for (var i = 0; i < TOKEN_MAPPING.length; i++) {
    if (TOKEN_MAPPING[i] == letter) 
      return i
  } 

  return null
}

function tokenize(i) {
  const mapping = {'a': 1, 't': 2, 'g': 3, 'c': 4, 'n': 5}
  return mapping[i.toLowerCase()]
}

function pad_sequences(a, m) {
  if (a.length > m) {
    return a.slice(-m)
  } else {
    let fill = Array(m - a.length).fill(0)
    return [...fill, ...a]
  }

}

function process_sequence(seq, for_classifier) {
  seq = character_mapping(seq)
  if (for_classifier) {
    seq = seq.map(letter_to_index)
  } else {
    seq = seq.map(tokenize)
  }

  return pad_sequences(seq, (for_classifier ? 250 : 256))
}

async function predict_detector(seq_1) {
  let seq = tensor2d(
    seq_1.map(i => process_sequence(i, false))
  )
  let p = await models.detector.predict(seq)
  let res = await p.array()
  seq.dispose()
  return res
}

async function predict_classifier(seq_1) {
  let seq = tensor2d(
    seq_1.map(i => process_sequence(i, true))
  )
  let p = await models.classifier.predict(seq)
  let res = await p.array()
  seq.dispose()
  return res
}

loadModels()

self.addEventListener('message', async function(e) {
  let {type, data} = e.data
  console.log("WORKER: Data Recv:", e.data)

  if (type == 'detectorModel') {
    let res = await predict_detector(data)

    self.postMessage({
      type: 'detectorPrediction',
      data: res
    })
  } else if (type == 'classifierModel') {
    let res = await predict_classifier(data)

    self.postMessage({
      type: 'classifierPrediction',
      data: res
    })
  }
}, false);