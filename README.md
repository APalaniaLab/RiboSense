# RiboSense
**A web-based ML pipeline for riboswitch annotation.**

Click [here](https://apalanialab.github.io/riboswitch) for the tool.

# About the tool
RiboSense is an online web-app tool, which under the hood uses a ML pipeline, to detect and classify riboswitch sequences in the given input. The online tool is created using Vue.js and TailwindCSS as main UI framework, and uses opensource libraries to parse sequencing formats like FASTA, GenBank, and SBOL. Tensorflow.js 2.0 is used for all model prediction in this tool, and is setup to run locally using your PC's CPU resources for the same.

The pipeline comprises of two models, one called the **Detector Model** and another called the **Classifier Model**, and both of these are manually chained as follows
* The given sequence is cropped and padded, and is input to the Detector Model
* The detector model predicts if the input is a riboswitch sequence
* If the detector model predicts the input not to be a riboswitch sequence, the pipeline ends and the detctor probability for this prediction is returned along with it.
* If the detector model predicts the input to be a riboswitch sequence, the input is then proessed and fed to the Classifier Model
* The Classifier Model predicts out of it's 31 trained riboswitch classes for the input
* The classifier output, it's prediction probaility along with the detector's prediction probaility is returned.

