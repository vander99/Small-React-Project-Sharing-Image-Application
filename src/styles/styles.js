import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //height: '80%',
        //width: '80%',
        backgroundColor: 'red',
    }
})

const login = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        width: '100%',
    },
    input: {
        height: 40,
        margin: 12,
        width: '90%',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: "4%",
    },
    signIn: {
        marginTop: "7%",
        marginBottom: "2%",
        width: '90%',
        height: "5%",
        backgroundColor: "#00bfff",
        borderRadius: 4,
        textAlign: "center",
        justifyContent: 'center',
    },
    signInText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    signUpText: {
        fontSize: 16,
        color: "#0183B8",
        fontWeight: '500',
    },
})

const home = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        width: '100%',
        height: '100%',
    },
    timeline: {
        height:"90%", 
        width:"100%",
    },
    publicationTextHeader: {
        padding: 10,
        fontSize: 12,
        fontWeight: 'bold',
        width: "100%",
    },
    publicationImage: {
        width: "100%",
        height: 250,
    },
    publicationCaption: {
        fontSize: 12,
        padding: 6,
        paddingBottom: 15
    },
    bottomButton : {
        backgroundColor:'green',
        height: "8%",
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: "#E6E6E6",
        position: 'absolute',
        bottom: 0,
    }
})

const homepage = StyleSheet.create({
    main : {
        height:"100%",
        width: "100%",
    },
    header : {
        width: "30%",
        paddingTop: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
})

export {styles, login, home, homepage}