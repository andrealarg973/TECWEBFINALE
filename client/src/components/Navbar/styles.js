import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    heading: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        fontSize: '2em',
        fontWeight: 300,
    },
    image: {
        marginLeft: '10px',
        marginTop: '5px',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '400px',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
        },
    },
    quotabar: {
        display: 'flex',
        justifyContent: 'flex-center',
        width: '600px',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            width: 'auto',
        },
        [theme.breakpoints.down('md')]: {
            width: 'auto',
            flexDirection: 'column',
        },
    },
    profile: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '400px',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            marginTop: 20,
            justifyContent: 'center',
        },
        [theme.breakpoints.down('md')]: {
            width: 'auto',
        },
        [theme.breakpoints.down('lg')]: {
            width: '300px',
        },
    },
    logout: {
        marginLeft: '20px',
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        width: 'auto'
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    wrapper: {
        border: '2px solid black',
        borderRadius: '50px',
        width: '190px',
        [theme.breakpoints.down('lg')]: {
            width: '130px',
        },
        [theme.breakpoints.down('md')]: {
            width: '190px',
        },
    }
}));