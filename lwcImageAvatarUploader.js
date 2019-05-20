/* eslint-disable no-irregular-whitespace */
/* eslint-disable dot-notation */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

import { LightningElement, api,wire,track} from 'lwc';
import getProfilePicture from '@salesforce/apex/FileUploadController.getProfilePicture' ;
import saveAttachment from '@salesforce/apex/FileUploadController.saveAttachment';
export default class LwcImageAvatarUploader extends LightningElement {
  
   
    @api recordId;
    @track pictureSource="https://s3-us-west-1.amazonaws.com/sfdc-demo/image-placeholder.png";
    @api file;
    @wire(getProfilePicture,{imageId:'$recordId'})
    attImg({ error, data }) {
    if (data) {
      this.pictureSource= '/servlet/servlet.FileDownload?file= '+data;   
    } else if (error) {
        console.log('error'+error);
    }
}
 /*  @wire(saveAttachment,{imageId:'$recordId' ,fileName: '$filename' ,base64Data:'$base64Data',contentType:'$filetype'})uploadeddata;
  */

    handleChange(event){
       this.file=event.target.files;
        let fileInput=this.file[0];
        this.file=fileInput;
     }
    save(){
        let fileInput=this.file;
        let rId=this.recordId;
        if (!this.file) return;
        if (!this.file.type.match(/(image.*)/)) {
			return alert('Image file format not supported');
		}

        // if (this.file.size > (this.MAX_FILE_SIZE)) {
    // 	alert('File size cannot exceed: ' + this.MAX_FILE_SIZE + ' bytes.\n' + 'Selected file size: ' + file.size);
    //     return;
        // }
        
        let fr = new FileReader();
        let self = this;
        fr.onloadend = function(){
            
            let dataURL = fr.result;
            self.pictureSource=fr.result;
            let base64Mark = 'base64,';
            let dataStart = dataURL.indexOf(base64Mark) + base64Mark.length;
            dataURL = dataURL.substring(dataStart);
            saveAttachment({imageId:rId ,fileName: fileInput.name ,base64Data:encodeURIComponent(dataURL),contentType:fileInput.type});
  
        };
        fr.readAsDataURL(fileInput); 
    }

    showModal () {
       this.template.querySelector('[data-id="modal"]').style.display = "block"; 
    }
    
    closeModal (){
        this.template.querySelector('[data-id="modal"]').style.display = "none";
    }
   
}