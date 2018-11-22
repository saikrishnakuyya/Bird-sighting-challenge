
document.addEventListener('DOMContentLoaded', function () {

    const table = document.querySelector('table.list tbody');
    const formNode = document.getElementById('newInformation');
    let isEditMode = false;
    let row = -1;

    document.addEventListener('click', function (evt) {
        if (evt.target.tagName === 'BUTTON' && evt.target.type === 'submit') {
            evt.preventDefault();
            if (!isEditMode) {
                addNewBirdSighting();
            } else {
                updateBirdSighting(row);
            }
        } else if (evt.target.tagName === 'INPUT' && evt.target.type === 'button' && evt.target.hasAttribute('data-action')) {
            const actionMethod = evt.target.getAttribute('data-action');
            const rowIndex = +evt.target.getAttribute('data-index');
            if (actionMethod === 'delete') {
                removeBirdSighting(rowIndex);
            } else if (actionMethod === 'edit') {
                editBirdSighting(rowIndex)
            }
        }
    })

    function addNewBirdSighting() {
        const validation = nameValidation();
        if (validation.vailid) {
            const formValues = Array.from(formNode.querySelectorAll('input')).map(x => x.value);

            const trNode = document.createElement('tr');
            const valuesInnerHTML = formValues.map((value) => {
                return `<td>${value}</td>`
            }).join("");
            const rowIndex = table.querySelectorAll('tr').length;
            const actionsInnerHTML = `<td><input type="button" data-index="${rowIndex}" data-action="delete" value="Delete">
            
            <input type="button" data-index="${rowIndex}" data-action="edit" value="Edit"></td>`
            trNode.innerHTML = valuesInnerHTML + actionsInnerHTML;
            table.appendChild(trNode);
            resetForm();
            document.querySelector('p.error').textContent = validation.message;
        } else {
            document.querySelector('p.error').textContent = validation.message;
        }
    }

    function removeBirdSighting(index) {
        if (Array.from(table.children)[index]) {
            table.removeChild(table.childNodes[index]);
        }
    }

    function resetForm() {
        formNode.querySelectorAll('input').forEach(x => x.value = "")
    }

    function editBirdSighting(index) {
        if (Array.from(table.children)[index]) {
            const rowNode = Array.from(table.children)[index];
            const cells = Array.from(rowNode.children).slice(0, -1);
            const values = cells.map(node => node.textContent);
            const formInputs = formNode.querySelectorAll('input');
            for (let i = 0; i < formInputs.length; i++) {
                formInputs[i].value = values[i];
            }
            isEditMode = true;
            row = index;
        }
    }

    function updateBirdSighting(index) {
        if (index > -1) {
            const formValues = Array.from(formNode.querySelectorAll('input')).map(x => x.value);
            const rowNode = Array.from(table.children)[index];
            const cells = Array.from(rowNode.children).splice(0, rowNode.children.length - 1);
            for (let i = 0; i < formValues.length; i++) {
                cells[i].textContent = formValues[i];
            }
            resetForm()
            isEditMode = false;
            row = -1;
        }
    }

    // validations 
    function nameValidation() {
        let name = document.getElementById("name").value;

        // check if there is number or invalid characters.
        if (name.trim().length > 0) {
            name = name.toLowerCase();
            isValid = Array.from(name).reduce((isValid, ch) => {
                return isValid &&  
                    (ch >= 'a' && ch <= 'z' || ch==" ")  
            }, true)

        } else {
            isValid = false;
        }

        return  isValid ? {
            vailid: true,
            message: '',
        } : {
                message: 'invalid name field : please enter only alphabets[a-z,A-Z]',
                valid: false
            }
    }


})



