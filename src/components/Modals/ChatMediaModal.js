import {Box, Image, Modal} from 'native-base';
import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import { imageMimetypes, videoMimetypes } from '../../constants/mimeTypes';
import VideoPlayer from 'react-native-video-player';
import { TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const ChatMediaModal = ({open, url, type, onClose}) => {
  const renderModalContent = () => {
    if (imageMimetypes[type]) {
      return (
        <Image alt="image" source={{uri: url}} w={'100%'} height={'100%'} />
      );
    }
    if (videoMimetypes[type]) {
      return (
        <TouchableOpacity
          // onPress={() => setVideoPaused(prev => !prev)}
          activeOpacity={1}
          style={{height: hp('100%'), width: '100%'}}>
          <VideoPlayer
            video={{
              uri: url,
            }}
            autoplay
            videoWidth={wp('100%')}
            videoHeight={hp('100%')}
            // thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      _backdrop={{
        bg: 'black',
      }}>
      <Box w={widthPercentageToDP('90%')} h="90%">
        <Modal.CloseButton color={'white'} />
        {renderModalContent()}
      </Box>
    </Modal>
  );
};
