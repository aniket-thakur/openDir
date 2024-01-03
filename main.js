(function(){
    let btn = document.querySelector('#btn1');
    let divContainer= document.querySelector('#container');
    let myTemplates = document.querySelector('#myTemplates');
    let myBreadcrum = document.querySelector('.divBreadCrum');
    let rootPath = document.querySelector('.path');
    let fid = -1;    // folder id
    let cfid = -1;   // current folder id in which we are
    let folders = [];  // to store the name and fid of every  folder
    btn.addEventListener('click', function(){
        let fname = prompt('Enter folder name:');
        fname = fname.trim();        // remove the spaces
        if(!!fname){
            let found = folders.filter(f => f.pid == cfid).some(f => f.name === fname); // return true if it found matching folder names
            if(found == false){  // false means,it found no  matching fname, which means we are good to go  
                ++fid;
                folders.push({
                    name : fname,
                    id : fid,
                    pid : cfid
                });
                addFolder(fname , fid, cfid);  
                console.log(folders);
                persistFolderToStorage();
            }
            else{
                alert(`${fname} already exists!!`);
            }
        }
        else{
            alert("Folder name cannot be empty")
        }
    });
    rootPath.addEventListener('click',breadcrumNav);
    //add folder
    function addFolder(fname, fid, pid){
        let divFolderTemplate = myTemplates.content.querySelector('.folders');
        let divFolder = document.importNode(divFolderTemplate, true);  // to create a copy of folders
        let divName= divFolder.querySelector("[purpose = 'name']");
        divFolder.setAttribute("fid", fid);  // unique id for folders   
        divFolder.setAttribute("pid", pid);   // pid => parent id

        divName.innerHTML = fname;
        divContainer.appendChild(divFolder);

        // delete a folder
        let delFolder = divFolder.querySelector("[action = 'del']");
        delFolder.addEventListener("click",deleteFolder);
        
        // edit folder name (closure)
        let editFolderName = divFolder.querySelector("[action='edit']");
        editFolderName.addEventListener('click', editFolder);

        // view folder
        let vFolder = divFolder.querySelector("[action='view']");
        vFolder.addEventListener("click", viewFolder);
    }   

    // breadcrum navigation
    function breadcrumNav(){
        // let name = this.innerHTML;
        // cfid = parseInt(this.getAttribute("fid"));  // cfid is the folder parent id
        cfid = this.getAttribute('fid');
        // Reset cfid if the root folder is clicked
        // if(cfid == -1){
        //     cfid = -1;
        // }
        divContainer.innerHTML = ""
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolder(f.name, f.id, f.pid)
        })
        // to remove the next thing in breadcrumb if the previous one is selected 
        //like if path is root -> a -> b -> c
        // and a is clicked in breadcrum then the 'b' and 'c' should be removed, that is what the 
        // while loop is doing 
        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }

        
    }
    // View folder function
    function viewFolder(){
    
        let divFolder =  this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute('fid'));  // this will be our parent folder

        let aDivTemplate = myTemplates.content.querySelector('.path');
        let aPath = document.importNode(aDivTemplate,true);

        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute('fid',cfid); 
        aPath.addEventListener('click',breadcrumNav);
        myBreadcrum.appendChild(aPath);

        divContainer.innerHTML = '';
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolder(f.name, f.id, f.pid)
        })
        

    };
    // delete folder
    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName= divFolder.querySelector("[purpose = 'name']");
        let flag = confirm(`${divName.innerHTML} will be removed!`);
            if(flag == true){
                let fid = parseInt(divFolder.getAttribute('fid'))  
                let exists= folders.some(f => f.pid == fid)
                if(exists == false){
                    let idx = folders.findIndex(f => f.id == fid);
                    folders.splice(idx , 1);
                    divContainer.removeChild(divFolder); 
                    persistFolderToStorage();   // preserve the data whenever a folder is created 
                }
                else{
                    alert("folder contains folder");
                }
                
            }     
    }; 
    //edit a folder   
    function editFolder(){
        let divFolder = this.parentNode;
        let divName= divFolder.querySelector("[purpose = 'name']");
        let fName2 = prompt("Enter folder name");
        fName2 = fName2.trim();   
            if(!!fName2){
                let found = folders.filter(f=> f.pid == cfid).some(f => f.name === fName2);
                if(found == false){
                    divName.innerHTML = fName2;
                    let fid = parseInt(divFolder.getAttribute('fid'))
                    let folder = folders.filter(f => f.pid == cfid).find(f => f.id == fid);
                    folder.name = fName2; // chage the edited name in the array also
                    console.log(folders);
                    persistFolderToStorage();   // preserve the data whenever a folder is created
                }
                else{
                    alert(`${fName2} already exists!!`);
                }
            }
            else{
                alert('Folder name cannot be empty');
            }
    };

    function persistFolderToStorage(){
        // console.log(folders);
        let folderJson = JSON.stringify(folders);
        localStorage.setItem("data", folderJson);
    };
    function loadFolderFromStorage(){
        let fJson = localStorage.getItem("data");
        if(!!fJson){
        folders = JSON.parse(fJson);
        let maxId = -1; 
        folders.forEach(f =>{
            if(maxId < f.id){     // so that when we refresh the page, the fid should not start from 1 and start
                maxId = f.id;   // from the last maxId
            }
            if(f.pid == cfid){
                addFolder(f.name, f.id,f.pid);
            }
            // let aPath = document.querySelector('.path');
            // aPath.addEventListener("click", breadcrumNav);
         });
         fid = maxId;

    }
    }
    loadFolderFromStorage();

})
();
