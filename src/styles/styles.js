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
        /*alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: '90%',
        paddingTop: 20,
        backgroundColor: 'black',*/
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

export {styles, login}