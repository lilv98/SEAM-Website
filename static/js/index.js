window.HELP_IMPROVE_VIDEOJS = false;

// Global variables for sorting
let currentSortColumn = -1;
let currentSortDirection = 'asc';

// Leaderboard sorting functionality
function sortTable(columnIndex) {
    console.log('sortTable called with columnIndex:', columnIndex);
    
    const table = document.getElementById('leaderboard');
    const tbody = document.getElementById('leaderboard-body');
    
    if (!table || !tbody) {
        console.error('Table or tbody not found');
        return;
    }
    
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        !row.classList.contains('proprietary-header') && 
        !row.classList.contains('opensource-header')
    );
    
    console.log('Found rows:', rows.length);
    
    // Determine sort direction
    let isAscending = true;
    if (currentSortColumn === columnIndex) {
        isAscending = currentSortDirection === 'desc';
    }
    
    currentSortColumn = columnIndex;
    currentSortDirection = isAscending ? 'asc' : 'desc';
    
    // Separate proprietary and open-source models
    const proprietaryRows = rows.filter(row => row.dataset.category === 'proprietary');
    const opensourceRows = rows.filter(row => row.dataset.category === 'opensource');
    
    // Update header indicators
    const headers = table.querySelectorAll('th.sortable');
    headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    if (headers[columnIndex]) {
        headers[columnIndex].classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    }
    
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
    const sortedProprietary = sortRows([...proprietaryRows]);
    const sortedOpensource = sortRows([...opensourceRows]);
    
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
    
    console.log('Table sorted successfully');
}

$(document).ready(function() {
    console.log('Document ready - initializing...');
    
    // Carousel functionality
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

    // Setup sorting functionality
    setTimeout(function() {
        console.log('Setting up table sorting...');
        
        // Use event delegation to handle clicks
        $(document).off('click', '.sortable').on('click', '.sortable', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const columnIndex = parseInt($(this).data('column'));
            console.log('Column clicked:', columnIndex);
            
            if (!isNaN(columnIndex)) {
                sortTable(columnIndex);
            } else {
                console.error('Invalid column index:', $(this).data('column'));
            }
        });
        
        // Add visual feedback
        $('.sortable').each(function() {
            $(this).css('cursor', 'pointer');
            console.log('Added cursor pointer to column:', $(this).data('column'));
        });
        
        console.log('Found sortable headers:', $('.sortable').length);
        console.log('Table setup complete');
        
    }, 500); // Increased timeout to ensure DOM is fully loaded

    // Initial sort by L-V Agreement (column 5) in descending order
    setTimeout(function() {
        const lvAgreementHeader = document.querySelector('[data-column="5"]');
        if (lvAgreementHeader) {
            lvAgreementHeader.classList.add('sort-desc');
            currentSortColumn = 5;
            currentSortDirection = 'desc';
        }
    }, 600);
    
});