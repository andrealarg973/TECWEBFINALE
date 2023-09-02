import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    media: {
        borderRadius: '20px',
        objectFit: 'cover',
        width: '100%',
        maxHeight: '600px',

    },
    media1: {
        height: 0,
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundBlendMode: 'darken',
    },
    card: {
        display: 'flex',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
            flexDirection: 'column',
        },
    },
    section: {
        borderRadius: '20px',
        margin: '10px',
        flex: 1,
    },
    imageSection: {
        marginLeft: '20px',
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
        },
    },
    recommendedPosts: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    loadingPaper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '15px',
        height: '39vh',
    },
    commentsOuterContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    commentsInnerContainer: {
        height: '200px',
        overflowY: 'auto',
        marginRight: '30px',
    },
    cardReply: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '10px',
        width: '90%',
        marginLeft: '5%',
        marginTop: '15px',
        marginBottom: '10px',
        position: 'relative',
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
    details: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px',
    },

}));