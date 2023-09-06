function getValueBasedOnCase(someCase) {
    switch (someCase) {
        case 'ngrok':
            return 'https://fc7b-84-33-117-23.ngrok-free.app/';
        case 'index':
            return 'https://f290-84-33-117-23.ngrok-free.app/'
        case 'localhost':
            return 'http://localhost:5000';
        case 'remote':
            return 'http://84.33.117.23:5000';
        default:
            return 'http://localhost:5000';
    }
}

export const URL = getValueBasedOnCase('localhost');
export const URL1 = getValueBasedOnCase('localhost');