document.addEventListener('DOMContentLoaded', function () {
    // Restores select box and checkbox state using the preferences stored in chrome.storage.
    function restore_options() {
        chrome.storage.sync.get({
            keywordsArray: []
        }, function (items) {
            buildOptDisplay(items.keywordsArray);
        });
    }

    function buildOptDisplay(items) {
        if (items.length == 0) {
            document.querySelector('.add-keyword').click();
        }
        for (var i = 0; i < items.length; i++) {
            //items[i] ...
            if (typeof items[i] === "object") {
                createRowWithOptions(items[i], i)
            }
        }
    }

    function createRowWithOptions(obj, int = 0) {
        console.log('build row', obj);
        var keywordRow = document.querySelector('.keyword-row').innerHTML;

        //remove first item
        if (typeof document.querySelector('.keyword-row').dataset.id === 'undefined') {
            document.querySelector('.keyword-row').remove();
        }

        /*var existingKeywords = document.querySelectorAll('.keyword-row .keyword input');
        for (var i = 0; i < existingKeywords.length; i++) {
            if (existingKeywords[i].value.toLowerCase() === obj.keyword.toLowerCase()) {
                alert('Keyword already exists!');
                return; // Don't add duplicate keywords
            }
        }*/

        var newRow = document.createElement('div');
        newRow.className = 'keyword-row';
        var timestamp = (Date.now() + int)
        newRow.dataset.id = timestamp
        newRow.innerHTML = keywordRow;
        document.querySelector('.keywords-holder').appendChild(newRow);
    
        var newEle = document.querySelector('.keywords-holder .keyword-row[data-id="' + timestamp + '"]')
        newEle.querySelector('.keyword input').value = obj.keyword;
        newEle.querySelector('.type select').value = obj.type;
        if (obj.type == '1') {
            newEle.querySelector('.replace').style.display = 'block';
            newEle.querySelector('.replace input').value = obj.replace;
        } else {
            newEle.querySelector('.replace').style.display = 'none';
        }
        newEle.querySelector('.type select').addEventListener('change', function (e) {
            var element = e.target;
            var parent = element.parentNode.parentNode;
            if (element.value == '1') {
                parent.querySelector('.replace').style.display = 'block';
            } else {
                parent.querySelector('.replace').style.display = 'none';
            }
        });
        newEle.querySelector('.remove').addEventListener('click', function (e) {
            if (document.querySelectorAll('.keyword-row').length == 1) {
                document.querySelector('.keyword-row').style.display = 'none';
                return;
            }
            newEle.remove();
        });
    }

    // Saves options to chrome.storage
    const buildSaveArray = () => {
        const elements = document.querySelectorAll('.keyword-row')
        const saveArray = [];
        // only include if row if not hidden
        elements.forEach(function (element) {
            if (element.style.display === 'none') {
                return;
            }
            const obj = {
                keyword: element.querySelector('.keyword input').value,
                type: element.querySelector('.type select').value,
                replace: element.querySelector('.replace input').value
            };
            saveArray.push(obj);
        });
        saveOptions(saveArray);
    };

    const saveOptions = (saveArray) => {
        chrome.storage.sync.set({
            keywordsArray: saveArray
        }, function () {
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    };

    // Add listener to add keyword button
    document.querySelector('.add-keyword').addEventListener('click', function () {
        var obj = {};
        obj.keyword = '';
        obj.type = '1';
        obj.replace = '';
        createRowWithOptions(obj);
    });

    // Initialize search functionality
    document.getElementById('search').addEventListener('input', filterKeywords);

    // Filter keywords based on search input
    function filterKeywords() {
        const searchInput = document.getElementById('search').value.trim().toLowerCase();
        const keywords = document.querySelectorAll('.keyword-row');
        let matchFound = false;
    
        keywords.forEach(keyword => {
            const keywordText = keyword.querySelector('.keyword input').value.toLowerCase();
            const display = keywordText.includes(searchInput) ? 'flex' : 'none';
            keyword.style.display = display;
    
            if (display === 'flex') {
                matchFound = true;
            }
        });
    
        // Display message when no matches are found and at least one alphanumeric character is entered
        const noMatchMessage = document.getElementById('no-match-message');
        noMatchMessage.style.display = searchInput.length > 0 && searchInput.match(/[a-zA-Z0-9]/) && !matchFound ? 'block' : 'none';
    }
    

    // Add listener to save button
    document.getElementById('save').addEventListener('click', buildSaveArray);

    // Restore options on DOM content load
    restore_options();
});
