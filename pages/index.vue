<template>
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="col-span-3 md:col-span-1">
          
          <div class="w-full md:max-w-md transition-all flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 hover:bg-blue-100 hover:dark:bg-gray-700 hover:text-base" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 mr-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Status</span>
            <div>
              <span class="font-medium">Detecting and classifying riboswitches</span>
                <ul class="mt-1.5 ml-4 list-disc list-inside">
                  <li v-if="!!modelError" class="text-red-800 dark:text-red-400">
                    Annotation tool will not work, as there was an error loading the ML models.
                  </li>
                  <span v-if="Object.keys(availableSequences).length > 0">
                    <li>
                      Parsed {{ Object.keys(availableSequences).length }} sequences from the input file.
                    </li>

                    <li v-if="Object.keys(selectedSeqIDs).length < 1">
                      Select sequence(s) to annotate
                    </li>
                    <li v-else-if="Object.keys(selectedSeqIDs).length == 1">
                      Single sequence instance annotation
                    </li>
                    <li v-else>
                      Batch of sequence instances for annotation
                    </li>
                    <li v-if="lengthClipCount > 0">
                      Clipped {{ lengthClipCount }} sequences base-pair length
                    </li>
                  </span>
                  <li v-else>
                    Upload input file of sequence(s) OR enter a sequence string
                  </li>
                  <li v-if="annotationResult.length > 0">
                    Annotated {{ annotationResult.length }} sequence(s)
                  </li>
                  <li v-if="!!loadingText" class="animate-pulse">
                    <b>{{ loadingText }}</b>
                  </li>
                  <li v-if="!!errorText" class="text-red-800 dark:text-red-400">
                    There was an error processing your request
                  </li>
              </ul>
            </div>
          </div>

          <div class="relative w-full md:max-w-md p-4 bg-gray-200 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <span :class="{hidden: !loadingText}" class="bg-blue-200 text-xs font-medium text-blue-800 text-center p-2 rounded-md dark:bg-blue-900 dark:text-blue-200 absolute -translate-y-1/2 translate-x-1/2 left-auto top-0 right-0">
              <div role="status">
                  <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                  <span class="sr-only">Loading...</span>
              </div>
            </span>

            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Input File (FASTA, GenBank, or SBOL) </h5>
                <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500" data-tooltip-target="helpInputTooltip" data-tooltip-trigger="click" data-tooltip-placement="bottom">
                    <p> Help</p>
                </a>
                <div id="helpInputTooltip" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700 w-60">
                    <p>Please upload a file containing the DNA sequences of interest. Accepted formats include FASTA, GenBank, and SBOL.</p>
                    <p>Select either one sequence to process, or you can choose bulk option to run the tool for all sequences in the file</p>
                    <p class="text-gray-100">Select bulk process with caution, as it will use local PC resources and might take some time depending on your PC specs.</p>
                </div>
            </div>
            <div class="flex-root">              
              <div class="flex items-center justify-center w-full flex-wrap gap-y-2">
                <div class="w-full mb-4" v-if="!!errorText || !!modelError">
                  <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-600 dark:text-red-400" role="alert">
                      <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                      </svg>
                      <span class="sr-only">Info</span>
                      <div>
                        {{ errorText || modelError}}
                      </div>
                    </div>
                </div>
                <div class="w-full" id="file-selector" v-if="!filename">
                  <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> (or drag and drop).</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">(<b>Max. 20MB</b>)</p>
                      </div>
                      <input @change="parseUploadedFile" id="dropzone-file" type="file" class="hidden" accept=".fasta,.fa,.gb,.gnk,.sbol"/>
                  </label>
                </div>
                
                <span :class="{hidden: !filename}">
                  <div class="w-full mt-4" id="file-control">
                      <p class="flex items-center justify-between"> <span class="inline-flex items-center justify-between"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.828 10h6.239m-6.239 4h6.239M6 1v4a1 1 0 0 1-1 1H1m14-4v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"/>
                      </svg> </span> <a href="#" class="text-blue-700 dark:text-blue-400 font-medium"> {{ filename || "FILE_NAME_PLACEHOLDER.fasta" }} </a>
                      <span @click="!loadingText && removeUploadedFile()" class="inline-flex items-center justify-between cursor-pointer text-gray-800 dark:text-white hover:hover:text-red-500 dark:hover:text-red-500" data-tooltip-target="tooltip-close-btn">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                      </span>
                    </p>
                    <div id="tooltip-close-btn" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                      Remove uploaded file
                    </div>
                  </div>

                  <div class="w-full mt-4" v-if="Object.keys(availableSequences).length < 1">
                    <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-600 dark:text-red-400" role="alert">
                      <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                      </svg>
                      <span class="sr-only">Info</span>
                      <div>
                        Unable to parse sequences from the file. Please check the file format.
                      </div>
                    </div>
                  </div>
                  
                  <div class="w-full mt-4" id="sequence-selector">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white mb-4">Select your sequence</h5>
                    <button id="sequenceSearch" data-dropdown-toggle="sequenceSearchDropdown" data-dropdown-placement="bottom" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full" type="button"> {{ Object.keys(selectedSeqIDs).length > 0 ? `Selected ${Object.keys(selectedSeqIDs).length} sequence(s)` : 'Select sequence(s)' }} <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                      </svg>
                    </button>
                    <div id="sequenceSearchDropdown" class="z-10 hidden bg-gray-300 shadow-inner rounded-lg w-72 dark:bg-gray-700">
                        <div class="p-3">
                          <label for="input-group-search" class="sr-only">Search</label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                            </div>
                            <input type="text" v-model="filterSequenceInput" id="input-group-search" class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Sequence ID">
                          </div>
                        </div>
                        <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200" aria-labelledby="dropdownSearchButton">
                          <li 
                            v-for="sequence in filteredSequenceIDs"
                            class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600" @click="toggleSelectSequence(sequence)">
                              <input @change="() => {return;}" :checked="!!selectedSeqIDs[sequence]" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                              <label class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{{sequence}}</label>
                            </div>
                          </li>
                          
                        </ul>
                        <div class="flex justify-between">
                          <a href="#" @click="updateSelectedIDs(true)" class="inline-flex items-center p-3 text-sm font-medium text-black hover:text-white dark:text-white dark:hover:text-white rounded-b-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline">
                            <span class="mr-4"><svg class="w-4 h-4 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                            </svg></span>
                              Select all
                          </a>
                          <a href="#" @click="updateSelectedIDs(false)" class="inline-flex items-center p-3 text-sm font-medium text-black hover:text-white dark:text-white dark:hover:text-white rounded-b-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline">
                          <span class="mr-4"><svg class="w-4 h-4 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                            </svg></span>
                            Clear all
                        </a>
                        </div>
                    </div>
                  </div>

                  <div v-if="Object.keys(selectedSeqIDs).length > 1"  class="flex items-center w-full p-4 mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-600 dark:text-yellow-300" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                      <span class="font-medium">Batch Process</span> will display the results for the first 50 sequences> If there are > 50 sequences in the input, please download the CSV file for RiboSense's annotation of all the sequences.
                    </div>
                  </div>

                  <div v-if="lengthClipCount > 0"  class="flex items-center w-full p-4 mt-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                      <span class="font-medium">{{ lengthClipCount }} of the selected sequences</span> have <i>base-pairs count</i> greater than 250, <span class="font-medium">only first 250bp will be considered</span>
                    </div>
                  </div>

                  <div class="w-full mt-4 flex justify-center">
                    <div class="inline-flex rounded-md shadow-sm" role="group">
                      <button @click="annotateSequence" :disabled="!!modelError || !!loadingText || Object.keys(selectedSeqIDs).length != 1" type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-green-400 border border-gray-200 rounded-l-lg enabled:hover:bg-green-500 enabled:hover:text-black focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-green-700 dark:border-gray-600 dark:text-white enabled:dark:hover:text-white enabled:dark:hover:bg-green-600 dark:focus:ring-blue-500 dark:focus:text-white disabled:bg-green-600 disabled:dark:bg-green-800">
                        <svg class="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h9M5 9h5m8-8H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4l3.5 4 3.5-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                        </svg>
                        Annotate Sequence
                      </button>
                      
                      <button  @click="annotateBatch" :disabled="!!modelError || !!loadingText || Object.keys(selectedSeqIDs).length < 2" type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-green-400 border border-gray-200 rounded-r-md enabled:hover:bg-green-500 enabled:hover:text-black focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-green-700 dark:border-gray-600 dark:text-white enabled:dark:hover:text-white enabled:dark:hover:bg-green-600 dark:focus:ring-blue-500 dark:focus:text-white disabled:bg-green-600 disabled:dark:bg-green-800">
                        <svg class="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.041 11.862A5 5 0 0 1 11 15.831V19M1 1v3.169a5 5 0 0 0 1.891 3.916M11 1v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 1 15.831V19M1 3h10M1.399 6h9.252M2 14h8.652M1 17h10"/>
                        </svg>
                        Batch Annotate
                      </button>
                    </div>
                  </div>
                </span>
              </div>
              
            </div>
          </div>
          
          <div class="relative w-full mt-4 md:max-w-md p-4 bg-gray-200 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Paste raw DNA sequence</h5>
                <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500" data-tooltip-target="helpManualInputTooltip" data-tooltip-trigger="click" data-tooltip-placement="bottom">
                    <p> Help</p>
                </a>
                <div id="helpManualInputTooltip" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700 w-60">
                    <p>Paste the sequence in the TextBox and click 'Run RiboSense' to annotate the input sequence.</p>
                </div>
            </div>
            <div class="flex-root">              
              <div class="flex items-center justify-center w-full flex-wrap gap-y-2">
                    <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label for="comment" class="sr-only">Your comment</label>
                            <textarea v-model="sequenceFromInput" id="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="ATGCATGCATGC..." required></textarea>
                        </div>
                        <div class="flex items-center justify-center px-3 py-2 border-t dark:border-gray-600">
                          <button @click="annotateSequenceFromInput" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.041 11.862A5 5 0 0 1 11 15.831V19M1 1v3.169a5 5 0 0 0 1.891 3.916M11 1v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 1 15.831V19M1 3h10M1.399 6h9.252M2 14h8.652M1 17h10"/>
                            </svg>
                            Run RiboSense
                          </button>
                        </div>
                    </div>
              </div>
            </div>
          </div>
        </div>
        <div ref='sequenceVisualizerElement' class="min-h-[34rem] max-h-[40rem] md:col-span-2 dark:text-white bg-gray-200 border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-gray-400 dark:border-gray-700">
          
        </div>
      </div>

      <div class="grid grid-cols-1 p-4" v-if="annotationResult.length > 0">
        <div class="inline-flex items-center justify-center w-full">
            <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
            <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"> Annotation Result </span>
        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  Riboswitch Annotations
                  <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">You can visualize and analyze first 50 sequences input directly in your browser, for further analysis you can download a <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">.CSV</span>file containing the analysis result of all the selected sequences</p>
              </caption>
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3">
                          #
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Sequence ID
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Riboswitch Detector
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Detector Probability
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Riboswitch Classifier
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Classifier Probability
                      </th>
                      <th scope="col" class="px-3 py-3">
                          <span class="sr-only">Visualize</span>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="item in pageItems">
                      <td class="px-6 py-4">
                        {{ item.index }}
                      </td>
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {{  item.item.id }}
                      </th>
                      <td class="px-6 py-4">
                          {{ item.item.detectorModelClassification.prediction == 1 }}
                      </td>
                      <td class="px-6 py-4">
                          {{ item.item.detectorModelClassification.probability.toFixed(4) }}
                      </td>
                      <td class="px-6 py-4">
                          {{ item.item.classifierModelClassification ? riboswitchClassLabels[item.item.classifierModelClassification.prediction + 1] : '' }}
                      </td>
                      <td class="px-6 py-4">
                        {{ item.item.classifierModelClassification ? item.item.classifierModelClassification.probability.toFixed(4) : '' }} 
                      </td>
                      <td class="px-3 py-4 text-right">
                          <a @click="visualizeRiboswitch(item.item)" href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Visualize</a>
                      </td>
                  </tr>
              </tbody>
          </table>
          <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 bg-white dark:bg-gray-800" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ (pageItems.length && pageItems[0].index) || 0 }} - {{ (pageItems.length && pageItems[pageItems.length - 1].index) || 0 }}
                    </span>
                    of 
                    <span class="font-semibold text-gray-900 dark:text-white">{{ totalItemsCount}}</span>
                </span>

                <ul class="inline-flex -space-x-px text-sm h-8">
                  <button @click="downloadPredictionCSV(annotationResult)" data-tooltip-target="download-help-tooltip" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 19">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15h.01M4 12H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-3M9.5 1v10.93m4-3.93-4 4-4-4"/>
                    </svg>
                    Download CSV
                  </button>
                  <div id="download-help-tooltip" role="tooltip" class="absolute z-10 w-56 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                      Click here to download a <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">.CSV</span> file containing the complete result, including the 50 displayed and also the sequences not displayed in the table.
                  </div>
                    <li>
                        <button @click="goToPage(currentPage - 1)" :disabled="currentPage == 1" class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:pointer-events-none">Previous</button>
                    </li>
                    <li>
                        <button @click="goToPage(currentPage + 1)" :disabled="currentPage == totalPages" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:pointer-events-none">Next</button>
                    </li>
                </ul>
            </nav>
        </div>
      </div>
      
      <footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
          <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-center">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              <b>Citation: Vigneshwaran Siva Sankaran, Krittika Narasimhan, Mridula Ganesan, Ashok Palaniappan. RiboSense: web-based pipeline for annotating genomic riboswitches. [submitted].
                We acknowledge support under Google TRC Compute grant (to A.P.) for developing RiboSense. </b>
            </span>
          </div>
      </footer>
    </div>
    
</template>

<script setup>
import { anyToJson } from "bio-parsers"
import ColorHash from 'color-hash'
import riboswitchClassLabels from '@/assets/riboswitchClassLabels.json'

var availableSequences = {
  
}
var fileUploaded = null
const {annotationResult, annotateSequenceList, modelError, loadModel} = useAnnotationModel()
const { totalPages, currentPage, pageItems, populateData, goToPage, totalItemsCount} = usePagination()
const { downloadPredictionCSV } = useCSVDownloader()
var SeqVizVisualizer = null
const colorHash = new ColorHash()

const sequenceFromInput = ref()
const sequenceVisualizerElement = ref()
const errorText = ref('')
const loadingText = ref('')
const filename = ref('')
const selectedSeqIDs = reactive({})
const filterSequenceInput = ref('')
const lengthClipCount = ref(0)
const filteredSequenceIDs = computed(() => {
  if (filterSequenceInput.value == '' || !filterSequenceInput.value) {
    return Object.keys(availableSequences)
  }

  let filtered = Object.keys(availableSequences).filter( seqID => {
    return seqID.toLocaleLowerCase().includes(filterSequenceInput.value.toLocaleLowerCase())
  })
  
  return filtered
})
const updateSelectedIDs = (selectAll) => {
  lengthClipCount.value = 0
  if (!selectAll) {
    Object.keys(selectedSeqIDs).forEach(key => delete selectedSeqIDs[key])
    return;
  }

  for (var i in filteredSequenceIDs.value) {
    var s = filteredSequenceIDs.value[i]
    selectedSeqIDs[s] = 1
    if (availableSequences[s].seq.length > 250)
      lengthClipCount.value++
  }
}
const parseUploadedFile = async (event) => {
  try {
    errorText.value = ''
    loadingText.value = 'Parsing uploaded file'
    fileUploaded = event.target.files[0]
    
    if (fileUploaded.size > 2e+7) {
      event.preventDefault()
      throw "File size is too big"
    }

    const parsedSequences = await anyToJson(fileUploaded)

    availableSequences = {}
    parsedSequences.forEach((seq, i) => {
      let name = seq.parsedSequence.name
      let id = name.split(" ")[0]
      availableSequences[id] = {
        name: name,
        id: id,
        seq: seq.parsedSequence.sequence
      }
    })

    loadingText.value = ''
    errorText.value = ''
    filename.value = fileUploaded.name
    updateSelectedIDs(false)
    filterSequenceInput.value = '~~~~~~'
    filterSequenceInput.value = null

  } catch (e) {
    console.log(e)
    loadingText.value = ''
    errorText.value = e
  }
}
const removeUploadedFile = () => {
  loadingText.value = ''
  availableSequences = {}
  errorText.value = ''
  filename.value = ''
  updateSelectedIDs(false)
  lengthClipCount.value = 0
}
const toggleSelectSequence = (seq_id) => {
  let length = availableSequences[seq_id].seq.length
  if (selectedSeqIDs[seq_id]) {
    if (length > 250) lengthClipCount.value = Math.max(lengthClipCount.value - 1, 0)
    delete selectedSeqIDs[seq_id]
  } else {
    if (length > 250) lengthClipCount.value++
    selectedSeqIDs[seq_id] = 1
  }
}

const visualizeRiboswitch = (annotate_data, seq_data) => {
  if (annotate_data == null) {
    SeqVizVisualizer.setState(
      {
        name: "Example Sequence",
        seq: "ATGCATGCATGCATGCATGC",
      }
    )

    return
  }
  console.log("annotating:", annotate_data)
  let name = annotate_data.id
  let annot = []

  let seq = seq_data ? seq_data.seq : availableSequences[name].seq
  console.log("seq=", seq)

  if (annotate_data.classifierModelClassification)
  {
    let ribo_class = annotate_data.classifierModelClassification.prediction + 1
    let label = riboswitchClassLabels[ribo_class]

    annot.push(
      { 
        name: label,
        start: 0, 
        end: Math.min(seq.length, 250), 
        direction: 1, 
        color: colorHash.hex(label) 
      }
    )
  }

  SeqVizVisualizer.setState(
    {
      name,
      seq,
      annotations: annot
    }
  )
}

const getSequenceList = () => {
  return Object.keys(selectedSeqIDs).map(id => availableSequences[id])
}
const annotateListOfSequence = async (sequences, customInput) => {
  try {
    await annotateSequenceList(sequences)
    populateData(annotationResult.value.slice(0, 50))

    let annotate_data = null
    for (var i = 0; i < annotationResult.value.length; i++) {
      let res = annotationResult.value[i]
      if (res.classifierModelClassification) {
        annotate_data = res
        break 
      }
    }
    
    if (customInput)
      visualizeRiboswitch(annotate_data, sequences[0])
    else
      visualizeRiboswitch(annotate_data)

    errorText.value = ''

  } catch (e) {
    errorText.value = typeof e == 'string' ? e : "There was an error processing the selected sequence(s)"
  } finally {
    loadingText.value = ''
  }
}
const annotateSequence = async () => {
  let sequences = getSequenceList()
  let seq = sequences[0]
  loadingText.value = `Annotating sequence: ${seq.name}`
  await annotateListOfSequence(sequences)
}
const annotateBatch = async () => {
  let sequences = getSequenceList()
  loadingText.value = `Annotating ${sequences.length} sequences`
  await annotateListOfSequence(sequences)
}
const annotateSequenceFromInput = async () => {
  sequenceFromInput.value = (sequenceFromInput.value || '').trim().replace("\n", "").replace(" ", "")

  if (!sequenceFromInput.value) {
    errorText.value = "No sequence provided"
    return 
  }

  const non_atgc = /[^ATGC]+/i
  if (sequenceFromInput.value.match(non_atgc)) {
      errorText.value = "Given input is not a DNA sequence"
      return
  }

  let sequences = [
    {
      name: "Input Sequence",
      id: "Input-Sequence",
      seq: sequenceFromInput.value
    }
  ]

  loadingText.value = `Annotating input sequence`
  await annotateListOfSequence(sequences, true)
}

useHead({
  title: 'RiboSense: Identifying riboswitches in genomic sequences - Systems CompBio Lab @ SASTRA Deemed University',
  meta: [{
    name: 'description',
    content: 'Tool to detect, classify, and annotate riboswitches'
  }],
  script: [
    {
      src: 'https://unpkg.com/seqviz'
    }
  ]
})

onMounted(() => {
    initFlowbite()
    
    SeqVizVisualizer = window.seqviz.Viewer(
      sequenceVisualizerElement.value,
      {
        name: "Example Sequence",
        seq: "ATGCATGCATGCATGCATGC",
      }
    )
    SeqVizVisualizer.render()

    loadModel()
    console.log("RIBOSWITCH CLASS LABELS:", riboswitchClassLabels)
})

onUpdated( () => {
  initFlowbite()
})
</script>

<style lang="postcss" scoped>
  .badge {
    @apply inline-block bg-gray-200 dark:bg-gray-950 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-400;
    &:hover {
      @apply bg-gray-300;
    }
  }
</style>
