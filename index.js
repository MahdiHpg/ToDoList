const addForm = document.getElementById('addForm'),
      input_add_list = document.getElementById('input_add_list'),
      searchPart = document.getElementById('searchPart'),
      noneDataTitle = document.getElementById('noneDataTitle'),
      alertTextInput = document.getElementById('alertTextInput'),
      btn_addToDoList = document.getElementById('btn-addToDo'),
      input_search = document.getElementById('input_search'),
      ul_lists = document.getElementById('ul_lists'),
      list_items = document.querySelectorAll('.list-Data'),
      btn_RemoveAll = document.querySelector('#btn-RemoveAll');
let editMode = false;

// get data for display from storage
function getDataFromStorageForDisplay() {
    let dataInStorage = getDataFromStorage();
    
    ul_lists.innerHTML = '';
    dataInStorage.forEach(data => createListInUL(data));

    refreshUL();
}
// add wroten data to list of ul
function addListInput(e) {
    e.preventDefault();

    const newData = input_add_list.value;
    if (newData == '') {
        alertTextInput.classList.remove('d-none');
        return;
    }
    else {
        alertTextInput.classList.add('d-none');
    }

    if (editMode) {
        const dataEdit = document.querySelector('.editMode');
        removeDataFromStorage(dataEdit.textContent);
        dataEdit.remove();
        btn_addToDoList.innerHTML = 'اضافه کردن <i class="bi bi-plus-lg"></i>';
        btn_addToDoList.classList.replace('btn-primary','btn-success');

        editMode = false;
    }
    // check for adding same data
    if (checkForSameData(newData)) {
        alertTextInput.innerHTML = '<small>نام وارد شده تکراری است!</small>';
        alertTextInput.classList.remove('d-none');
        return;
    }
    else
        alertTextInput.classList.add('d-none');

    createListInUL(newData);
    setDataToStorage(newData);

    input_add_list.value = '';
    
    refreshUL();
}
// set data to storage
function setDataToStorage(data) {
    let dataInStorage = getDataFromStorage();
    
    dataInStorage.push(data);
    localStorage.setItem('data', JSON.stringify(dataInStorage));
}
// get data from storage
function getDataFromStorage() {
    let dataInStorage;
    if (localStorage.getItem('data') === null) 
        dataInStorage = [];
    else
        dataInStorage = JSON.parse(localStorage.getItem('data'));

    return dataInStorage;
}
// create the data input to li
function createListInUL(data) {
    const li = document.createElement('li');
    li.classList = 'list-Data';
    li.textContent = data;
    
    const i = document.createElement('i');
    i.classList = 'delBtn bi bi-x';
    li.appendChild(i);

    ul_lists.appendChild(li);
}
// remove data from localStorage
function removeDataFromStorage(data) {
    let dataInStorage = getDataFromStorage();

    dataInStorage = dataInStorage.filter((i) => i !== data);
    localStorage.setItem('data', JSON.stringify(dataInStorage));
    refreshUL();
}
function removeData(data) {
    data.remove();
    removeDataFromStorage(data.textContent);
    refreshUL();
}
// edit or delete data
function onClickListItems(data) {
    if (data.target.classList.contains('delBtn'))
        removeData(data.target.parentElement);
    else 
        setDataToEdit(data.target);

    refreshUL();
}
// remove all data
function RemoveAllData() {
    ul_lists.innerHTML = '';
    localStorage.removeItem('data');
    refreshUL();
}
// check same data
function checkForSameData(data) {
    let dataInStorage = getDataFromStorage();
    return dataInStorage.includes(data);
}
// search data
function searchData(data) {
    const allData = document.querySelectorAll('li');
    const textInput = data.target.value.toLowerCase();
    let found = false;

    allData.forEach((d) => {
        const dataName = d.firstChild.textContent.toLowerCase();
        if (dataName.indexOf(textInput) !== -1) {
            d.style.display = 'block';
            noneDataTitle.style.display = 'none';
            found = true;
        }
        else {
            d.style.display = 'none';
        }
    });
    if (found)
        noneDataTitle.style.display = 'none';
    else {
        noneDataTitle.style.display = 'block';
        noneDataTitle.innerHTML = '<small>اطلاعاتی یافت نشد !</small>';
    }
}
// update/refresh Ul
function refreshUL() {
    const data = document.querySelectorAll('li');
    if (data.length === 0) {
        searchPart.style.display = 'none';
        btn_RemoveAll.style.display = 'none';
        noneDataTitle.style.display = 'block';
        noneDataTitle.innerHTML = '<small>لیستی وجود ندارد!</small>';
    }
    else {
        searchPart.style.display = 'block';
        btn_RemoveAll.style.display = 'block';
        noneDataTitle.style.display = 'none';
    }
}
// edit data
function setDataToEdit(data) {
    editMode = true;

    data.querySelectorAll('li').forEach((d) => d.classList.remove('editMode'));

    data.classList.add('editMode');
    input_add_list.value = data.textContent;

    btn_addToDoList.innerHTML = 'ثبت ویرایش <i class="bi bi-pencil"></i>';
    btn_addToDoList.classList.replace('btn-success','btn-primary');
}

// add data
addForm.addEventListener('submit', addListInput);

// get and show the data
document.addEventListener('DOMContentLoaded', getDataFromStorageForDisplay);

// Delete/Edit the data
ul_lists.addEventListener('click', onClickListItems);

// Remove all Data
btn_RemoveAll.addEventListener('click', RemoveAllData);

// search Data from the list
input_search.addEventListener('input', searchData);