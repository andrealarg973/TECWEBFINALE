import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundBlendMode: 'darken',
    },
    mediaVideo: {
        maxHeight: '200px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundBlendMode: 'darken',
    },
    border: {
        border: 'solid',
    },
    fullHeightCard: {
        height: '100%',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        marginBottom: '20px',
    },
    cardReply: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '10px',
        width: '90%',
        marginLeft: '5%',
        marginTop: '5px',
        marginBottom: '10px',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
    },
    overlay2: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        borderRadius: '60px',
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: 'darkgray',
        },
        '&:active': {
            color: 'green',
        },
    },
    grid: {
        display: 'flex',
    },
    details: {
        margin: '20px',
        width: '100%',
    },
    title: {
        padding: '0 16px',
    },
    cardActions: {
        padding: '0 16px 8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial',
    },
    descSubscribe: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', // Add this to distribute items horizontally
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    buttonSubmit: {
        display: 'flex',
        width: 'auto',
        height: '40px',
        position: 'relative',
        alignItems: 'center',
        marginRight: '40px',
        minWidth: '130px',
    },
}));