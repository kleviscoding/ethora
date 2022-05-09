/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

// import {realm} from './allSchemas';
import Realm from 'realm';
import * as schemaTypes from '../../constants/realmConstants';
import { databaseOptions } from './allSchemas';
//fucntion to check if the room exists
async function checkQuery(checkType, check, callback) {
  const realm = await Realm.open(databaseOptions)
  let messages = realm.objects(schemaTypes.MESSAGE_SCHEMA);

  if (messages.filtered(`${checkType}="${check}"`)) {
    callback(true);
  }
  // const message = realm.objects(schemaTypes.MESSAGE_SCHEMA)
}

//function to check message_id exists
async function filter(query, schema, callback) {
  const realm = await Realm.open(databaseOptions)
  let schemaSelected = realm.objects(schema);
  let check = schemaSelected.filtered(query);
  callback(Array.from(check));
}
export const getMessage = id =>
  new Promise(async(resolve, reject) => {
    const realm = await Realm.open(databaseOptions)
    const chatList = realm.objectForPrimaryKey(schemaTypes.MESSAGE_SCHEMA, id);
    resolve(chatList);
  });
//insert message
export const insertMessages = (
  data,
  room_name,
  tokenAmount,
  receiverMessageId,
) =>
  new Promise((resolve, reject) => {
    let messageObject = {};
    if (!data.system) {
      messageObject = {
        message_id: data._id, //unique
        text: data.text,
        createdAt: data.createdAt,
        user_id: data.user._id,
        name: data.user.name,
        avatar: data.user.avatar,
        system: data.system,
        realImageURL: data.realImageURL,
        localURL: data.localURL,
        image: data.image,
        mimetype: data.mimetype,
        size: data.size,
        isStoredFile: data.isStoredFile,
        room_name,
        duration: data.duration,
        tokenAmount,
        waveForm: data.waveForm,
      };
    }
    if (data.system) {
      messageObject = {
        message_id: data._id, //unique
        text: data.text,
        createdAt: data.createdAt,
        system: data.system,
        room_name,
      };
    }

    getMessage(data._id).then(async(message) => {
      if(!message) {
        const realm = await Realm.open(databaseOptions)
        realm.write(() => {
          realm.create(schemaTypes.MESSAGE_SCHEMA, messageObject);
          resolve(messageObject);
        });
        updateMessageObject({tokenAmount, receiverMessageId});
      }
    })
    //check if message_id already exists
    // filter(`message_id="${data._id}"`, schemaTypes.MESSAGE_SCHEMA, callback => {
    //   //if not
    //   if (callback.length === 0) {
    //     realm.write(() => {
    //       realm.create(schemaTypes.MESSAGE_SCHEMA, messageObject);
    //       resolve(messageObject);
    //     });
    //     updateMessageObject({tokenAmount, receiverMessageId});
    //   }
    //   //if yes
    //   else return null;
    // });
  });

//fetch message object of a particular room
export const queryRoomAllMessages = room_name =>
  new Promise((resolve, reject) => {
    checkQuery('room_name', room_name, async(callback) => {
      if (callback) {
        const realm = await Realm.open(databaseOptions)
        let chats = realm
          .objects(schemaTypes.MESSAGE_SCHEMA)
          .filtered(`room_name="${room_name}" SORT(createdAt ASC)`);
        resolve(Array.from(chats));
      }
    });
  });

//update message object
export const updateMessageObject = data =>
  new Promise(async(resolve, reject) => {
    const realm = await Realm.open(databaseOptions)
    realm.write(() => {
      let messageObject = realm.objectForPrimaryKey(
        schemaTypes.MESSAGE_SCHEMA,
        data.receiverMessageId,
      );
      // console.log(messageObject.tokenAmount,"Bgvdsbfshjmgfvd")
      //update token amount for a message
      if (data.tokenAmount) {
        messageObject.tokenAmount =
          messageObject.tokenAmount + data.tokenAmount;
      }

      if (data.localURL) {
        console.log(data.localURL, 'inasdnajsncakljsn');
        messageObject.localURL = data.localURL;
        messageObject.isStoredFile = true;
      }
    });
  });
