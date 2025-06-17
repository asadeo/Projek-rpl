import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    color: 'white'
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    color: 'black'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0d1b2a',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
  }
});
