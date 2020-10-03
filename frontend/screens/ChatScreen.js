import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import io from "socket.io-client";

export default function ChatList() {
  const [socket, setSocket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    setSocket(io("http://127.0.0.1:3000"));
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected!");
      });
      socket.on("chat message", (msg) => {
        setChatMessages(chatMessages.concat(msg));
      });
    }
  }, [socket, chatMessages]);
  const messages = chatMessages.map((message, index) => {
    return (
      <Text key={index} style={{ borderWidth: 2, top: 500 }}>
        {message}
      </Text>
    );
  });

  const submitChatMessage = () => {
    socket.emit("chat message", chatMessage);
    setChatMessage("");
  };

  return (
    <View style={styles.container}>
      {messages}
      <TextInput
        style={{ height: 40, borderWidth: 2, top: 600 }}
        autoCorrect={false}
        value={chatMessage}
        onSubmitEditing={() => submitChatMessage()}
        onChangeText={(chatMessage) => {
          setChatMessage(chatMessage);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
});
