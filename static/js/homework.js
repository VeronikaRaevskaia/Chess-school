var files = [];
var download_flugs = [];


var nf_button = document.getElementById("new-homework");
nf_button.addEventListener("change", function() {
    var local_files = [];
    var ul = document.querySelector('ul.new-files');
    for (var i=0; i < nf_button.files.length; i++) {
        local_files[i] = nf_button.files[i];

        if(files[i]!=nf_button.files[i] || !files[i]) {
            files.push(nf_button.files[i]);
            var new_li = document.createElement('li');
            ul.appendChild(new_li);
            var new_info = document.createElement('div');
            new_info.classList.add('file-info');
            new_li.appendChild(new_info);
            var new_process = document.createElement('div');
            new_li.appendChild(new_process);
            new_process.classList.add('process');
            var new_name = document.createElement('div');
            new_info.appendChild(new_name);
            new_name.classList.add('name');
            var new_img = document.createElement('img');
            new_name.appendChild(new_img);
            new_img.classList.add('status');
            new_img.src = "../static/icons/file.png";
            var new_span = document.createElement('span');
            new_name.appendChild(new_span);
            new_span.innerHTML = local_files[i].name;
            var new_aside = document.createElement('aside');
            new_info.appendChild(new_aside);
            new_aside.classList.add('dop');
            var new_size = document.createElement('span'); //добавляем размер файла
            new_aside.appendChild(new_size);
            var size = local_files[i].size;
            if(size >= 1000000){
                size = (size/1000000).toFixed(1);
                new_size.innerHTML = String(size) + " Мбайт";
            }
            else
            if(size >= 1000){
                size = (size/1000).toFixed(1);
                new_size.innerHTML = String(size) + " Kбайт";
            }
            else {
                size = (size/1000).toFixed(1);
                new_size.innerHTML = String(size) + " байт";
            }
            var new_delete = document.createElement('span');
            new_aside.appendChild(new_delete);
            new_delete.classList.add('delete');
            new_delete.innerHTML = "Удалить";
            new_delete.addEventListener("click", canFileDelete);
            new_aside.appendChild(new_delete);
            var new_bar = document.createElement('div');
            new_process.appendChild(new_bar);
            new_bar.classList.add('bar');
        }
    }

    if(files)
        ul.classList.add('show');
    document.querySelector('div.buttons').classList.add('show');
    canSendFiles(files);
}, false);


function processBar(i, width) {
    var bar = document.querySelectorAll('div.bar');
    if(bar[i])
        bar[i].style.width = width + '%';
}

function messageDelete() {
    document.querySelector('div.buttons span').innerHTML = '';
}

function canSendFiles(files) {
    document.querySelector('.button.send').onclick = function () {
        var group_content = checked_group.innerHTML;
        var student_content = checked_student.innerHTML;
        var span = document.querySelector('div.buttons span');
        var img = document.querySelectorAll('img.status');
        var length = files.length;
        if(group_content == '0' || student_content == '0') {
            var formData = new FormData();
            var j = 0;
            formData.append('file', files[0]);
            formData.append('group', group_content);
            formData.append('student', student_content);

            var request = new XMLHttpRequest();
            request.onloadstart = function () {
                if(img[j])
                    img[j].src = "../static/icons/uploading.png";
                if (j == 0)
                    span.innerHTML = 'Идет загрузка ... ';
            };
            request.upload.onprogress = function (event) {
                processBar(j, 100 * event.loaded / event.total);
            };
            request.open('POST', '/upload_file');
            request.send(formData);
            request.onload = request.onerror = function () {
                if (this.status == 200) {
                    var data = JSON.parse(request.responseText);
                    if(img[j])
                        img[j].src = "../static/icons/success.png";
                    if (j == (length - 1)) {
                        span.innerHTML = 'Загрузка завершена';
                        newFileCreation(data);
                        setTimeout(messageDelete, 3000);
                        setTimeout(clearFiles, 3000);
                    }
                    formData.delete('file');
                    j++;
                    if (j < length) {
                        formData.append('file', files[j]);
                        request.open('POST', '/upload_file');
                        request.send(formData);
                        newFileCreation(data);
                    }
                } else {
                    img[i].src = "../static/icons/failed.png";
                }
            };
        }
        else {
            span.innerHTML = 'Необходимо выбрать группу или ученика';
            setTimeout(messageDelete, 3000);
            for(var k=0; k<length; k++){
                if(img[k])
                    img[k].src =  "../static/icons/failed.png";
            }
        }
    }
}
document.querySelector('.button.cancel').addEventListener("click", clearFiles);

function clearFiles() {
        document.querySelector('div.buttons').classList.remove('show');
        var li = document.querySelectorAll('ul.new-files li');
        var length = files.length;
        for (var i = 0; i < length; i++) {
            if(li[i])
                li[i].remove();
            if(files[i])
            delete files[i];
        }
        nf_button.value = '';
}

var class_select = document.getElementById('class-select');
var student_select = document.getElementById('student-select');
var checked_group = class_select.querySelector('span');
var group = document.querySelectorAll('li.group');
var checked_student = student_select.querySelector('span');
var student = document.querySelectorAll('li.student');

function activeClass() {
    this.classList.toggle('active');
}

class_select.addEventListener("click", activeClass);
student_select.addEventListener("click", activeClass);

for(var i=0; i<group.length; i++){
    group[i].onclick = function () {
        checked_group.innerHTML = this.querySelector('a').innerHTML;
        checked_group.classList.remove('hide');
        class_select.addEventListener("click", activeClass);
        checked_student.innerHTML = '0';
        checked_student.classList.add('hide');
    }
}

for(var j=0; j<student.length; j++){
    student[j].onclick = function () {
        checked_student.innerHTML = this.querySelector('a').innerHTML;
        checked_student.classList.remove('hide');
        student_select.addEventListener("click", activeClass);
        checked_group.innerHTML = '0';
        checked_group.classList.add('hide');
    }
}

function canFileDelete() {
    var file_block = this.parentElement.parentElement.parentElement;
    var ul = document.querySelector('ul.new-files');
    if(ul.length == '0')
        document.querySelector('div.buttons').classList.remove('show');
    for(var j=0; j<ul.children.length; j++){
        if(file_block == ul.children[j]) {
            delete files[j];
            file_block.remove();
        }
    }
}

var download = document.querySelectorAll('button.download');
var delete_button = document.querySelectorAll('button.delete');
var file_name = document.querySelectorAll('span.file-name');
var close_file = document.querySelectorAll('span.close-file');
for(var k=0; k<download.length; k++){
    download[k].addEventListener("click", downloadHomework);
}

for(var m=0; m<delete_button.length; m++){
    delete_button[m].addEventListener("click", deleteHomework);
}

for(var l=0; l<close_file.length; l++){
    close_file[l].addEventListener("click", deleteHomework);
}


function downloadHomework() {
    var download = document.querySelectorAll('button.download');
    for(var i=0; i<download.length; i++) {
        var number;
        if(download[i] == this){
            if(!download_flugs[i]) {
                number = i;
                var add = file_name[number].innerHTML;
                var a = this.querySelector('a');
                var new_href = a.getAttribute('href') + add;
                a.setAttribute('href', new_href);
                download_flugs[i] = true;
            }
        }
    }
}

function deleteHomework() {
    var delete_button = document.querySelectorAll('button.delete');
    var delete_span = document.querySelectorAll('span.close-file');
    for(var n=0; n<delete_button.length; n++) {
        var number;
        if(delete_button[n] == this || delete_span[n] == this) {
            number = n;
            var xhr = new XMLHttpRequest();
            var json = JSON.stringify(file_name[number].innerHTML);
            xhr.open('POST', '/delete_file', true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        delete_button[number].parentElement.parentElement.remove();
                        checkForEmpty();
                    }
                }
            };
            xhr.send(json);
        }
    }
}


function checkForEmpty() {
    var files = document.querySelectorAll('li.file-name');
    var empty_block = document.querySelector('ul.empty-block');
    var homeworks_block = document.querySelector('div.homeworks-block');
    if(files.length > 0) {
        homeworks_block.classList.add('show');
        empty_block.classList.remove('show')
    }
    else {
        empty_block.classList.add('show');
        homeworks_block.classList.remove('show');
    }
}

function newFileCreation(data) {
    var length = data.files.length;
    var div = document.querySelector('div.homeworks-block');
    for(var i=0; i<length; i++) {

        var new_homework = document.createElement('ul');
        new_homework.classList.add('homework');
        var old_first_homework = div.firstChild;
        div.insertBefore(new_homework, old_first_homework);

        var new_file_name_li = document.createElement('li');
        new_file_name_li.classList.add('file-name');
        new_homework.appendChild(new_file_name_li);

        var new_file_name_span = document.createElement('span');
        new_file_name_span.classList.add('file-name');
        new_file_name_span.innerHTML = data.files[i].filename;
        new_file_name_li.appendChild(new_file_name_span);

        var new_close_file = document.createElement('span');
        new_close_file.classList.add('close-file');
        new_close_file.innerHTML = '&times;';
        new_file_name_li.appendChild(new_close_file);
        new_close_file.addEventListener("click", deleteHomework);

        var new_li_img = document.createElement('li');
        new_li_img.classList.add('image');
        new_homework.appendChild(new_li_img);

        var new_img = document.createElement('img');
        var src = '../static/icons/' + data.files[i].format + '.png';
        new_img.setAttribute('src', src);
        new_li_img.appendChild(new_img);

        var new_li_rec = document.createElement('li');
        new_li_rec.innerHTML = data.files[i].reciever;
        new_homework.appendChild(new_li_rec);

        var new_li_date = document.createElement('li');
        new_li_date.innerHTML = data.files[i].date;
        new_homework.appendChild(new_li_date);

        var new_li_buttons = document.createElement('li');
        new_li_buttons.classList.add('buttons-block');
        new_homework.appendChild(new_li_buttons);

        var new_download_button = document.createElement('button');
        new_download_button.classList.add('download');
        new_li_buttons.appendChild(new_download_button);

        var new_a_button = document.createElement('a');
        new_a_button.innerHTML = 'Скачать';
        var href = '/uploads/' + data.files[i].filename;
        new_a_button.setAttribute('href', href);
        new_a_button.setAttribute('target', '_blank');
        new_download_button.appendChild(new_a_button);

        var new_delete_button = document.createElement('button');
        new_delete_button.innerHTML = 'Удалить';
        new_delete_button.classList.add('delete');
        new_li_buttons.appendChild(new_delete_button);
        new_delete_button.addEventListener("click", deleteHomework);
    }

    checkForEmpty();

}

window.addEventListener("load", checkForEmpty);