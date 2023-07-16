export default function (perPage) {
    var data = []
    
    const itemsPerPage = ref(perPage || 10)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const pageItems = ref([])
    const totalItemsCount = ref(0)
    
    const populateData = (d) => {
        data = d.slice()
        resetPage()
    }

    const resetPage = () => {
        totalPages.value = Math.ceil(data.length / itemsPerPage.value)
        totalItemsCount.value = data.length
        goToPage(1)
    }

    const goToPage = (page) => {
        page = Math.max(1, Math.min(page, totalPages.value))
        let startIndex = (page - 1) * itemsPerPage.value
        
        console.log("going to page:", page, startIndex, startIndex + itemsPerPage.value)
        currentPage.value = page
        pageItems.value = data.slice(startIndex, startIndex + itemsPerPage.value).map( (v, i) => {
            return {
                index: startIndex + i + 1,
                item: v
            }
        })
    }

    return {
        itemsPerPage,
        totalPages,
        currentPage,
        pageItems,
        populateData,
        resetPage,
        goToPage,
        totalItemsCount,
    }
}