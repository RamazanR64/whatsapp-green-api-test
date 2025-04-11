// Файл: App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [receivingMessages, setReceivingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat, chats]);

  useEffect(() => {
    let intervalId;
    
    if (isLoggedIn && receivingMessages) {
      intervalId = setInterval(receiveMessage, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn, receivingMessages, idInstance, apiTokenInstance]);

  const handleLogin = () => {
    if (!idInstance || !apiTokenInstance) {
      alert('Пожалуйста, введите учетные данные GREEN-API');
      return;
    }
    
    // В настоящем приложении здесь следует добавить проверку учетных данных
    setIsLoggedIn(true);
    setReceivingMessages(true);
  };

  const createChat = () => {
    if (!phoneNumber) {
      alert('Пожалуйста, введите номер телефона');
      return;
    }
    
    // Валидация номера телефона
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.length < 10) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }
    
    if (!chats[formattedPhone]) {
      setChats({
        ...chats,
        [formattedPhone]: []
      });
    }
    
    setCurrentChat(formattedPhone);
    setPhoneNumber('');
  };

  const sendMessage = async () => {
    if (!currentChat || !message) return;

    try {
      const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: `${currentChat}@c.us`,
          message: message
        })
      });

      const data = await response.json();
      
      if (data.idMessage) {
        // Добавляем сообщение в чат
        setChats(prevChats => ({
          ...prevChats,
          [currentChat]: [
            ...prevChats[currentChat],
            { id: data.idMessage, type: 'outgoing', text: message, timestamp: new Date().toISOString() }
          ]
        }));
        setMessage('');
      } else {
        alert('Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  const receiveMessage = async () => {
    try {
      // Получаем уведомления
      const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, {
        method: 'GET'
      });

      const notification = await response.json();
      
      if (notification && notification.receiptId) {
        // Обрабатываем уведомление
        if (notification.body.typeWebhook === 'incomingMessageReceived' && 
            notification.body.messageData.typeMessage === 'textMessage') {
          
          const senderNumber = notification.body.senderData.sender.split('@')[0];
          const messageText = notification.body.messageData.textMessageData.textMessage;
          
          // Проверяем, есть ли уже такой чат
          if (!chats[senderNumber]) {
            setChats(prevChats => ({
              ...prevChats,
              [senderNumber]: []
            }));
          }
          
          // Добавляем входящее сообщение в чат
          setChats(prevChats => ({
            ...prevChats,
            [senderNumber]: [
              ...(prevChats[senderNumber] || []),
              { 
                id: notification.body.idMessage, 
                type: 'incoming', 
                text: messageText, 
                timestamp: new Date().toISOString() 
              }
            ]
          }));
        }
        
        // Удаляем обработанное уведомление
        await fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${notification.receiptId}`, {
          method: 'DELETE'
        });
      }
    } catch (error) {
      console.error('Ошибка при получении сообщения:', error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setReceivingMessages(false);
    setIdInstance('');
    setApiTokenInstance('');
    setCurrentChat(null);
    setChats({});
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <div className="login-container">
          <h1>GREEN-API WhatsApp Web Clone</h1>
          <input
            type="text"
            placeholder="Введите idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
          <input
            type="password"
            placeholder="Введите apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <button onClick={handleLogin}>Войти</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>Чаты</h2>
              <button onClick={logout} className="logout-btn">Выйти</button>
            </div>
            <div className="new-chat">
              <input
                type="text"
                placeholder="Номер телефона (с кодом страны)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button onClick={createChat}>Создать чат</button>
            </div>
            <div className="chat-list">
              {Object.keys(chats).map((phone) => (
                <div
                  key={phone}
                  className={`chat-item ${currentChat === phone ? 'active' : ''}`}
                  onClick={() => setCurrentChat(phone)}
                >
                  <div className="chat-avatar"></div>
                  <div className="chat-info">
                    <div className="chat-name">+{phone}</div>
                    <div className="chat-last-message">
                      {chats[phone].length > 0
                        ? chats[phone][chats[phone].length - 1].text.substring(0, 30) + (chats[phone][chats[phone].length - 1].text.length > 30 ? '...' : '')
                        : 'Нет сообщений'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-main">
            {currentChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-avatar"></div>
                  <div className="chat-name">+{currentChat}</div>
                </div>
                <div className="messages-container">
                  {chats[currentChat] && chats[currentChat].map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Введите сообщение"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage}>Отправить</button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Выберите чат или создайте новый</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
