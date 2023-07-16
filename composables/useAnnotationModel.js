import ModelWorker from '@/assets/workers/workerModel?worker'
import { argMax } from '@tensorflow/tfjs'
const modelError = ref('')

export default function () {
    var workerModel = null

    const annotationResult = ref([])
    var annotation_output = []
    var sequences = []
    var sequences_to_classify = []
    var modelPredictionPromise = {
      promise: null,
      resolve: null,
      reject: null
    };

    const predict_detector = (sequences) => {
      workerModel.postMessage({
        type: 'detectorModel',
        data: sequences
      })
    }

    const predict_classifier = (sequences) => {
      workerModel.postMessage({
        type: 'classifierModel',
        data: sequences
      })
    }

    const detectorResultHandler = async (binary_classifier_output) => {
      sequences_to_classify = []
      annotation_output = []

      for (var i = 0;  i < binary_classifier_output.length; i++) {
        let is_riboswitch = await argMax(binary_classifier_output[i]).array()
        annotation_output.push({
          name: sequences[i].name,
          id: sequences[i].id,
          detectorModelClassification: {
            prediction: is_riboswitch,
            probability: binary_classifier_output[i][is_riboswitch]
          }
        })
        if (is_riboswitch) {
          sequences_to_classify.push([sequences[i], i])
        }
      }

      if (sequences_to_classify.length < 1) { 
        sequences = []
        modelPredictionPromise.resolve()
      }
      else
        predict_classifier(
          sequences_to_classify.map((i) => i[0].seq)
        )
    }

    const classifierResultHandler = async (classifier_output) => {
      for (var i = 0; i < classifier_output.length; i++) {
        let riboswitch_class = await argMax(classifier_output[i]).array()
        let j = sequences_to_classify[i][1]
        annotation_output[j].classifierModelClassification = {
          prediction: riboswitch_class,
          probability: classifier_output[i][riboswitch_class]
        }
      }

      modelPredictionPromise.resolve()
      sequences = []
      sequences_to_classify = []
    }

    const annotateSequenceList = async (seqs) => {
      annotationResult.value = []
      sequences = seqs

      if (modelPredictionPromise.promise != null) 
        modelPredictionPromise.reject()
        
      modelPredictionPromise.promise = new Promise((res, rej) => {
        modelPredictionPromise.resolve = res
        modelPredictionPromise.reject = rej
      })

      predict_detector(
        seqs.map(i => {
          if (!i.seq) throw `No sequence found for - ${i.name}`
          return i.seq
        })
      )
      
      await modelPredictionPromise.promise;
      annotationResult.value = annotation_output
    }

    const loadModel = () => {
      if (workerModel != null) {
        return
      }

      workerModel = new ModelWorker()
      workerModel.addEventListener('message', (e) => {
        const {type, data} = e.data
        console.log("ANNOTATION TOOL: Data Recv:", e.data)
        if (type == 'error') {
          modelError.value = data
        } else if (type == 'detectorPrediction') {
          detectorResultHandler(data)
        } else if (type == 'classifierPrediction') {
          classifierResultHandler(data)
        }
      })
    }

    return {
        annotationResult,
        annotateSequenceList,
        modelError,
        loadModel,
    }
}