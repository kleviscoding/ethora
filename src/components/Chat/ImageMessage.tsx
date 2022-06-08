import {Box, Image} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {formatBytes} from '../../helpers/chat/formatBytes';
import {MessageSize} from './MessageSize';

interface ImageMessageProps{
  url:any,
  size:any,
  onLongPress?:any,
  onPress:any
}

export const ImageMessage = ({url, size, onLongPress, onPress}:ImageMessageProps) => {
  const formatedSize = formatBytes(parseFloat(size), 2);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderRadius: 5,
        justifyContent: 'center',
        position: 'relative',
      }}>
      <MessageSize unit={formatedSize.unit} size={formatedSize.size} />

      <Box p={'1.5'}>
        <FastImage
          style={{width: heightPercentageToDP('22%'), height: heightPercentageToDP('22%'), borderRadius: 10}}
          source={{uri: url}}
          alt={'Image message'}
        />
      </Box>
    </TouchableOpacity>
  );
};
