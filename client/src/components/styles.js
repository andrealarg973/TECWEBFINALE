
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    ul: {
        justifyContent: 'space-around',
    },
    appBarSearch: {
        borderRadius: 4,
        marginBottom: '1rem',
        display: 'flex',
        padding: '16px',
    },
    pagination: {
        borderRadius: 4,
        marginTop: '1rem',
        padding: '16px',
    },
    gridContainer: {
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse',
        },
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        justifyContent: 'center',
    },
    paperContainer: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        justifyContent: 'center',
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
    channelTitle: {
        color: 'cyan',
    }

}));