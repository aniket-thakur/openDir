(function(){
    let btn = document.querySelector('#btn1');
    let divContainer= document.querySelector('#container');
    let myTemplates = document.querySelector('#myTemplates');
    let fid = 0;
    let folders = [];  // to store the name and fid of every  folder
    
        //add folder
    btn.addEventListener('click', function(){
        let fname = prompt('Enter folder name:');
        if(!fname){
            return;
        };
        ++fid;
        addFolder(fname , fid);
        folders.push({
            name : fname,
            id : fid
        });
        console.log(folders);
        persistFolderToStorage();
    
    
    });
    function addFolder(fname, fid){
        let divFolderTemplate = myTemplates.content.querySelector('.folders');
        let divFolder = document.importNode(divFolderTemplate, true);  // to create a copy of folders
        let divName= divFolder.querySelector("[purpose = 'name']");
        divFolder.setAttribute("fid", fid);  // uniquer id for folders
        divName.innerHTML = fname;
        divContainer.appendChild(divFolder);

        // delete a folder
        let delFolder = divFolder.querySelector("[action = 'del']");
        delFolder.addEventListener("click",deleteFolder);
        
        // edit folder name (closure)
        let editFolderName = divFolder.querySelector("[action='edit']");
        editFolderName.addEventListener('click', editFolder);
    }    
    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName= divFolder.querySelector("[purpose = 'name']");
        let flag = confirm(`${divName.innerHTML} will be removed!`);
            if(flag == true){   
                let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute('fid')));
                console.log(idx);
                folders.splice(idx , 1);
                console.log(folders);
                divContainer.removeChild(divFolder); 
                persistFolderToStorage();   // preserve the data whenever a folder is created 
            }     
    };    
    function editFolder(){
        let divFolder = this.parentNode;
        let divName= divFolder.querySelector("[purpose = 'name']");
        let fName2 = prompt("Enter folder name");
            if(!fName2){
                return;
            }
            divName.innerHTML = fName2;
            let folder = folders.find(f => f.id == parseInt(divFolder.getAttribute('fid')));
            folder.name = fName2; // chage the edited name in the array also
            console.log(folders);
            persistFolderToStorage();   // preserve the data whenever a folder is created
        
    };

    function persistFolderToStorage(){
        // console.log(folders);
        let folderJson = JSON.stringify(folders);
        localStorage.setItem("data", folderJson);
    };
    function loadFolderFromStorage(){
        let fJson = localStorage.getItem("data");
        if(!!fJson){
        let folders = JSON.parse(fJson);
        folders.forEach(function(f){
            addFolder(f.name, f.id);
         });
    }
    }
    loadFolderFromStorage();

})
();
