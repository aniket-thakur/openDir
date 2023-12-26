(function(){
    let btn = document.querySelector('#btn1');
    let divContainer= document.querySelector('#container');
    let myTemplates = document.querySelector('#myTemplates');
    let fid = 0;

    btn.addEventListener('click', function(){
        let fname = prompt('Enter folder name:');
        if(!fname){
            return;
        }
        let divFolderTemplate = myTemplates.content.querySelector('.folders');
        let divFolder = document.importNode(divFolderTemplate, true);  // to create a copy of folders
        let divName= divFolder.querySelector("[purpose = 'name']");
        divFolder.setAttribute("fid", ++fid);  // uniquer id for folders
        divName.innerHTML = fname;
        divContainer.appendChild(divFolder);
        // delete a folder(Using closure )
        let delFolder = divFolder.querySelector("[action = 'del']");
        delFolder.addEventListener("click",function(){
            let flag = confirm(`${fname} will be removed!`);
            if(flag == true){    
                divContainer.removeChild(divFolder);
            }
            
        });
        // edit folder name (closure)
        let editFolderName = divFolder.querySelector("[action='edit']");
        editFolderName.addEventListener('click', function(){
            let fName2 = prompt("Enter folder name");
            if(!fName2){
                return;
            }
            divName.innerHTML =fName2;
        });
        divContainer.appendChild(divFolder);
    });
    
})
();