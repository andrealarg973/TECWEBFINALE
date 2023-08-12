
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    fileInput: {
        width: '97%',
        margin: '10px 0',
    },
    buttonSubmit: {
        marginBottom: 10,
    },
    charLeft: {
        alignContent: "right"

    },
    inputTime: {
        marginBottom: 10,
        width: '40%',
        fontSize: '26px'
    },
    check: {
        width: '20px',
        height: '20px'
    }
}));