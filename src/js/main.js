"use strict";

// HTML File Uploader With Drag & Drop Functionality & File Attribute Validation

(() => {

  // If HTML input type 'file' attribute exists within document continue otherwise return
  if (document.querySelector('input[type="file"]')) {

    // Store core HTML elements used for file uploader
    const domElements = {
      fileForm: document.getElementById('uploadForm'),
      fileContainer: document.getElementById('uploadContainer'),
      fileInput: document.getElementById('fileUpload'),
      fileIcon: document.querySelector('[data-file-upload-icon]'),
      fileStatus: document.querySelector('[data-file-upload="status"]'),
      fileSubmitBtn: document.getElementById('fileUploadSubmit')
    }

    // ****************************** HANDLE UPLOADED FILE OBJECTS ************************************* //

    // Function to handle file object when initally provided by user input
    const fileUploadHandler = (filesObject) => {

      // Convert file object to an array
      const fileList = [].slice.call(filesObject);

      if (fileList.length == 0) {
        // Reset to core elements to their default state if no files array is empty
        fileUploadStatusReset();

      } else {
        // Check file(s) against imposed constraints (file size & file type)
        fileUploadCheck(fileList);
      }
    }

    // ****************************** CHECK UPLOADED FILE OBJECTS ************************************* //

    const fileUploadCheck = (fileList) => {

      // Check files against size limit constraints
      fileUploadSizeCheck(fileList);

      // Check files against format constraints
      fileUploadFormatCheck(fileList);

      const fileUploadErrors = [];

      fileList.forEach((file) => {
        if (file.sizeError || file.formatError) {
          fileUploadErrors.push('true')
        }
      });

      (fileUploadErrors.length > 0) ? fileUploadErrorReporting(fileList) : fileUploadSuccess(fileList);
    }

    // ******************************** FILE FORMAT CHECK ********************************************* //

    // Function to check if files uploaded are of accepted file format
    const fileUploadFormatCheck = (fileList) => {

      if(domElements.fileInput.getAttribute('accept')) {

        // Grab string of accepted file types from HTML input and covert to array
        const fileInputAccept = domElements.fileInput.getAttribute('accept');
        const fileTypes = fileInputAccept.split(", ");

        fileList.forEach((file) => {
          // Grab extension of file passed
          let fileName = file.name;
          let fileExtension = fileName.substring(fileName.lastIndexOf('.'), fileName.length) || fileName

          // check if file extension exists in accepted fileTypes array and add status to file object
          if (fileTypes.indexOf(fileExtension) < 0) {
            file.formatError = fileInputAccept;
          }
          return fileList;
        });

      } else {
        return fileList;
      }
    }

    // ********************************* FILE SIZE CHECK ********************************************** //

    // Function to check if files uploaded are within file size limit restrictions
    const fileUploadSizeCheck = (fileList) => {

      // If file size limit passed in data attribute then use it else default to 5MB
      const fileSizeLimit = domElements.fileInput.getAttribute('data-file-size') ? domElements.fileInput.getAttribute('data-file-size') : '5242880';

      // If file size exceeds file size limit add status to file object
      fileList.forEach((file) => {
        if (file.size > fileSizeLimit) {
          const fileSizeLimitFormatted = fileSizeLimit.substring(0, 1);
          file.sizeError = fileSizeLimitFormatted + 'MB';
        }
        return fileList;
      });
    }

    // **************************** REPORT FILE UPLOAD SUCCESS ***************************************** //

    // Function to maniplute file upload elements to report valid file uploads
    const fileUploadSuccess = (fileList) => {
      // Update upload container styles and upload icon
      domElements.fileContainer.className = 'upload-container status--success';
      domElements.fileIcon.setAttribute('data-file-upload-icon', 'uploaded');

      // Update form submit button attributes
      if(domElements.fileSubmitBtn.hasAttribute('disabled')) {
        domElements.fileSubmitBtn.removeAttribute('disabled');
        domElements.fileSubmitBtn.className = 'btn--primary';
      }

      // Remove all children from status message holder
      removeChildElements(domElements.fileStatus);

      // Construct and add new status message and item list to status message holder
      const statusMessage = document.createElement('p');
      statusMessage.setAttribute('aria-live', 'assertive');
      statusMessage.setAttribute('aria-role', 'alert');
      statusMessage.innerText = 'The following files are ready to be uploaded:';

      const statusList = document.createElement('ul');

      fileList.forEach((file) => {
        let statusListItem = document.createElement('li');
        statusListItem.setAttribute('aria-live', 'assertive');
        statusListItem.setAttribute('aria-role', 'alert');
        statusListItem.innerText = `${file.name} (${file.size} bytes)`;
        statusList.appendChild(statusListItem);
      });

      domElements.fileStatus.className ='status--highlight theme--success';
      domElements.fileStatus.appendChild(statusMessage);
      domElements.fileStatus.appendChild(statusList);
    }

    // **************************** REPORT FILE UPLOAD ERRORS ***************************************** //

    // Function to maniplute file upload elements to report file upload errors
    const fileUploadErrorReporting = (fileList) => {
      // Update upload container styles and upload icon
      domElements.fileContainer.className = 'upload-container status--warning';
      domElements.fileIcon.setAttribute('data-file-upload-icon', 'upload-error');

      // Update form submit button attributes
      if(!domElements.fileSubmitBtn.hasAttribute('disabled')) {
        domElements.fileSubmitBtn.setAttribute('disabled', 'disabled');
        domElements.fileSubmitBtn.className = 'btn--disabled';
      }

      // Remove all children from status message holder
      removeChildElements(domElements.fileStatus);

      // Construct and add new status message and item list to status message holder
      const statusMessage = document.createElement('p');
      statusMessage.setAttribute('aria-live', 'assertive');
      statusMessage.setAttribute('aria-role', 'alert');
      statusMessage.innerText = 'The following files have errors:';

      const statusList = document.createElement('ul');

      fileList.forEach((file) => {
        if(file.sizeError) {
          let statusListItem = document.createElement('li');
          statusListItem.setAttribute('aria-live', 'assertive');
          statusListItem.setAttribute('aria-role', 'alert');
          statusListItem.innerText = `${file.name} is too big. Please make sure it is smaller than ${file.sizeError}`;
          statusList.appendChild(statusListItem);
        }
        if(file.formatError) {
          let statusListItem = document.createElement('li');
          statusListItem.setAttribute('aria-live', 'assertive');
          statusListItem.setAttribute('aria-role', 'alert');
          statusListItem.innerText = `${file.name} is not an accepted file type. Please make sure the format of your file is ${file.formatError}`;
          statusList.appendChild(statusListItem);
        }
      });

      domElements.fileStatus.className ='status--highlight theme--warning';
      domElements.fileStatus.appendChild(statusMessage);
      domElements.fileStatus.appendChild(statusList);
    }

    // **************************** RESET FILE UPLOAD STATUS ***************************************** //

    // Function to reset file upload elements to their default settings
    const fileUploadStatusReset = () => {
      // Update upload container styles and upload icon
      domElements.fileContainer.className = 'upload-container status--standard';
      domElements.fileIcon.setAttribute('data-file-upload-icon', 'upload');

      // Update form submit button attributes
      if(domElements.fileSubmitBtn.hasAttribute('disabled')) {
        domElements.fileSubmitBtn.removeAttribute('disabled');
        domElements.fileSubmitBtn.className = 'btn--primary';
      }

      // Remove all children from status message holder
      removeChildElements(domElements.fileStatus);

      // Construct and add new status message to status message holder
      const statusMessage = document.createElement('p');
      statusMessage.setAttribute('aria-live', 'assertive');
      statusMessage.setAttribute('aria-role', 'alert');
      statusMessage.innerText = 'No files selected';

      domElements.fileStatus.appendChild(statusMessage);
      domElements.fileStatus.className = 'status--highlight';
    }

    // ******************************* FILE SUBMISSION MESSAGE **************************************** //

    const fileUploadSubmit = (event) => {
      // Prevent default actions on form
      preventDefaults(event);

      // Reset file upload form
      domElements.fileForm.reset();

      // Reset to core elements to their default state
      fileUploadStatusReset();

      // Remove all children from status message holder
      removeChildElements(domElements.fileStatus);

      // Construct and add new status message to status message holder
      const statusMessage = document.createElement('p');
      statusMessage.setAttribute('aria-live', 'assertive');
      statusMessage.setAttribute('aria-role', 'alert');
      statusMessage.innerText = 'Thank you for using my example file uploader. Your files have not been sent anywhere and the upload form has been reset for you to try again.';

      domElements.fileStatus.className ='status--highlight theme--success';
      domElements.fileStatus.appendChild(statusMessage);
    }

    // *********************************** DRAG & DROP ************************************************ //

    // Function to grab the files object from 'drop' event and pass to fileUploadHandler function
    const fileUploadDrop = (event) => {
      const dataTransferFiles = event.dataTransfer.files;
      fileUploadHandler(dataTransferFiles);
    }

    // Function to style drag and drop container element when it gains focus
    const fileUploadDragFocus = (event) => {
      domElements.fileContainer.className = 'upload-container status--focused';
    }

    // Function to style drag and drop container element when it loses focus
    const fileUploadDragBlur = (event) => {
      domElements.fileContainer.className = 'upload-container status--standard';
    }

    // ******************************** HELPER FUNCTIONS ********************************************* //

    // Helper function to prevent default action and bubbling on events
    const preventDefaults = (event) => {
      event.stopPropagation();
      event.preventDefault();
    }

    // Helper to remove all child elements from given parent
    const removeChildElements = (parentNode) => {
      if(parentNode.hasChildNodes()){
        while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
        }
      }
    }

    // ******************************** EVENT LISTENERS ********************************************* //

    // Add listeners to handle button click and drag & drop events
    domElements.fileInput.addEventListener('change', function(){ fileUploadHandler(this.files) });
    domElements.fileContainer.addEventListener('drop', fileUploadDrop);

    // Add listeners to highlight / unhighlight drag and drop container element
    domElements.fileContainer.addEventListener('dragenter', fileUploadDragFocus);
    domElements.fileContainer.addEventListener('dragover', fileUploadDragFocus);
    domElements.fileContainer.addEventListener('dragleave', fileUploadDragBlur);

    // Add listeners to prevent default actions for drag and drop elements
    domElements.fileContainer.addEventListener('dragenter', preventDefaults);
    domElements.fileContainer.addEventListener('dragover', preventDefaults);
    domElements.fileContainer.addEventListener('dragleave', preventDefaults);
    domElements.fileContainer.addEventListener('drop', preventDefaults);

    // Add listener to form submission event to prevent defaults and show submssion message
    domElements.fileForm.addEventListener('submit', fileUploadSubmit);

    // Add or remove class for Firefox if element is in focus so label (button) is visually highlighted
    domElements.fileInput.addEventListener('focus', () => domElements.fileInput.classList.add('js-has-focus'));
    domElements.fileInput.addEventListener('blur', () => domElements.fileInput.classList.remove('js-has-focus'));

  } else {
    return;
  }

})();
