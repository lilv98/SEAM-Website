window.HELP_IMPROVE_VIDEOJS = false;

// Leaderboard sorting functionality
function sortTable(columnIndex) {
    const table = document.getElementById('leaderboard');
    const tbody = document.getElementById('leaderboard-body');
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        !row.classList.contains('proprietary-header') && 
        !row.classList.contains('opensource-header')
    );
    
    // Separate proprietary and open-source models
    const proprietaryRows = rows.filter(row => row.dataset.category === 'proprietary');
    const opensourceRows = rows.filter(row => row.dataset.category === 'opensource');
    
    // Get current sort direction
    const headers = table.querySelectorAll('th.sortable');
    const currentHeader = headers[columnIndex];
    const isAscending = currentHeader.classList.contains('sort-desc');
    
    // Clear all sort indicators
    headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Set current sort indicator
    currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    
    // Sort function
    function sortRows(rowsArray) {
        return rowsArray.sort((a, b) => {
            let aVal = a.cells[columnIndex].textContent.trim();
            let bVal = b.cells[columnIndex].textContent.trim();
            
            // Handle numeric values
            if (columnIndex > 0) {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
                return isAscending ? aVal - bVal : bVal - aVal;
            } else {
                // Handle text values (model names)
                return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
        });
    }
    
    // Sort both categories
    const sortedProprietary = sortRows(proprietaryRows);
    const sortedOpensource = sortRows(opensourceRows);
    
    // Clear tbody and rebuild
    tbody.innerHTML = '';
    
    // Add proprietary header and rows
    const proprietaryHeader = document.createElement('tr');
    proprietaryHeader.className = 'proprietary-header';
    proprietaryHeader.innerHTML = '<td colspan="9" style="font-style: italic; font-weight: bold; background-color: #e8e8e8;">Proprietary Models</td>';
    tbody.appendChild(proprietaryHeader);
    
    sortedProprietary.forEach(row => tbody.appendChild(row));
    
    // Add open-source header and rows
    const opensourceHeader = document.createElement('tr');
    opensourceHeader.className = 'opensource-header';
    opensourceHeader.innerHTML = '<td colspan="9" style="font-style: italic; font-weight: bold; background-color: #e8e8e8;">Open-Source Models</td>';
    tbody.appendChild(opensourceHeader);
    
    sortedOpensource.forEach(row => tbody.appendChild(row));
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    // Add click handlers for sortable columns
    document.querySelectorAll('.sortable').forEach((header, index) => {
        header.addEventListener('click', () => sortTable(index));
    });

    // Initial sort by L-V Agreement (column 5) in descending order
    const lvAgreementHeader = document.querySelector('[data-column="5"]');
    if (lvAgreementHeader) {
        lvAgreementHeader.classList.add('sort-desc');
    }

})