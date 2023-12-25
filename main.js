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

        let delFolder = divFolder.querySelector("[action = 'del']");
        delFolder.addEventListener("click",function(){
            let flag = confirm(`${fname} will be removed!`);
            if(flag == true){
                divContainer.removeChild(divFolder);
            }
            
        });
    });
    
})
();