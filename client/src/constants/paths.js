function getValueBasedOnCase(someCase) {
    switch (someCase) {
        case 'server':
            return 'https://3cd4-84-33-117-23.ngrok-free.app/';
        case 'media':
            return 'https://d840-84-33-117-23.ngrok-free.app'
        case 'localhost8000':
            return 'http://localhost:8000/api';
        case 'localhost5000':
            return 'http://localhost:5000/api';
        case 'giovanna':
            return 'https://site222316.tw.cs.unibo.it/api';
        case 'giovanna_media':
            return 'https://site222316.tw.cs.unibo.it';
        case 'remote':
            return 'http://84.33.117.23:5000';
        default:
            return 'http://localhost:5000';
    }
}

//export const URL = getValueBasedOnCase('giovanna_media'); // media
//export const URL1 = getValueBasedOnCase('giovanna'); // server
export const URL = getValueBasedOnCase('localhost5000'); // media
export const URL1 = getValueBasedOnCase('localhost5000'); // server