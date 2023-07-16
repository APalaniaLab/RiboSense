import riboswitchClassLabels from '@/assets/riboswitchClassLabels.json'

export default function () {

    const arrayToCsv = (data) => {
        return data.map(row =>
          row
          .map(String)  // convert every value to String
          .map(v => v.replaceAll('"', '""'))  // escape double colons
          .map(v => `"${v}"`)  // quote it
          .join(',')  // comma-separated
        ).join('\r\n');  // rows starting on new lines
    }
    
    const downloadBlob = (content, filename, contentType) => {
        var blob = new Blob([content], { type: contentType });
        var url = URL.createObjectURL(blob);
      
        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', filename);
        pom.click();
    }

    const predictionToArray = (res) => {
        let arr = []
        for (var i = 0; i < res.length; i++) {
            let r = res[i]
            arr.push([
                r.id,
                r.detectorModelClassification.prediction,
                r.detectorModelClassification.probability,
                r.classifierModelClassification ? r.classifierModelClassification.prediction : '',
                r.classifierModelClassification ? riboswitchClassLabels[r.classifierModelClassification.prediction + 1]: '',
                r.classifierModelClassification ? r.classifierModelClassification.probability : ''
            ])
        }

        return arr
    }

    const downloadPredictionCSV = async (predictionResult) => {
        console.log("result", predictionResult)
        const headers = [['Sequence ID', 'Riboswitch Detector', 'Riboswitch Detector Probability', 'Riboswitch Classifier', 'Riboswitch Label', 'Riboswitch Classifier Probability']]
        const values = predictionToArray(predictionResult)

        const csv_data = arrayToCsv([...headers, ...values])
        downloadBlob(csv_data, 'RiboswitchToolResult.csv', 'text/csv;charset=utf-8;')
    }

    return {
        downloadPredictionCSV
    }
}