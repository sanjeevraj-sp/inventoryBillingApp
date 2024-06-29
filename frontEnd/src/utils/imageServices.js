
const getFileAsBlob = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = dataURLToBlob(reader.result);
            resolve(blob);
        };
        reader.readAsDataURL(file);
    });
};

const dataURLToBlob = (dataURL) => {
    const base64Index = dataURL.indexOf('base64,') + 'base64,'.length;
    const base64String = dataURL.substring(base64Index);
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' }); 
};


const convertBase64 = async (image) => {
    return new Promise((resolve, reject) => {
        if (!(image instanceof Blob)) {
            reject(new Error('Parameter is not of type Blob'));
        }

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};


export default {
  convertBase64,
  getFileAsBlob
}