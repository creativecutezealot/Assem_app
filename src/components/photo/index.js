import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {
    AWS_REGION,
    AWS_ACCESSKEY,
    AWS_SECRETKEY,
    cdnLink,
    ratio4_3,
} from '../../helpers/config';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import Touchable from '../touchable';
import { RNS3 } from 'react-native-s3-upload';
const camera = require('../../assets/images/register/camera.png');
const options = {
    title: 'Select Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.7,
    },
};

const { width, height } = Dimensions.get('window');
const logoHeight = width * 0.5;
const logoWidth = width * 0.6;

function TakePhoto({
    onChangeURI,
    onCallBack = () => {},
    photoURL = '',
    defaultW = logoWidth,
    defaultH = logoHeight,
    ratio = ratio4_3,
    style = {},
}) {
    const [photo, setPhoto] = useState(photoURL);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (photoURL !== '') {
            setPhoto(photoURL);
        }
    }, [photoURL]);

    const pickImageFromRoll = async () => {
        ImagePicker.showImagePicker(options, async response => {
            if (response.didCancel) {
                console.log('@@@@@ User cancelled image picker');
            } else if (response.error) {
                console.log('@@@@@ ImagePicker Error: ', response.error);
            } else {
                setLoading(true);
                imageResizer(response);
            }
        });
    };

    const imageResizer = async response => {
        const imageUri = response.uri;
        var newWidth = 320;
        var newHeight = 320;
        if (response.height) {
            newHeight = (response.height * newWidth) / response.width;
        }
        ImageResizer.createResizedImage(
            imageUri,
            newWidth,
            newHeight,
            'JPEG',
            100
        )
            .then(async ({ uri }) => {
                const file = {
                    uri: uri,
                    name: response.fileName
                        ? `${response.fileName}`
                              .toLowerCase()
                              .replace('heic', 'jpg')
                        : `${new Date().getTime().toString()}.jpeg`,
                    type: response.type ? response.type : 'image/jpeg',
                };
                const uploadoptions = {
                    keyPrefix: '',
                    bucket: 'futureof-image',
                    region: AWS_REGION,
                    accessKey: AWS_ACCESSKEY,
                    secretKey: AWS_SECRETKEY,
                    successActionStatus: 201,
                };
                try {
                    const res = await RNS3.put(file, uploadoptions);
                    setLoading(false);
                    if (res.status === 201) {
                        const uriAws = res.body
                            ? `${cdnLink}${ratio}/${res.body.postResponse.key}`
                            : '';
                        setPhoto(uriAws);
                        onChangeURI(uriAws);
                    } else {
                        console.log('@@@@@ Failed to upload image to S3: ', res);
                    }
                } catch (error) {
                    console.log('@@@@@ photo upload', error);
                    crashlytics().log('photo upload failed');
                    crashlytics().recordError(error);
                    setLoading(false);
                }
            })
            .catch(err => {
                crashlytics().log('photo resize failed');
                crashlytics().recordError(err);
                console.log('@@@@@ resizer', err);
                setLoading(false);
            });
    };

    return (
        <Touchable
            onPress={() => {
                pickImageFromRoll();
                if (photo !== '') {
                    onCallBack(photo);
                }
            }}
        >
            <View style={[styles.cameraWrapper, style]}>
                <Spinner visible={loading} />
                <Image
                    source={photo === '' ? camera : { uri: photo }}
                    style={{
                        width: defaultW,
                        height: defaultH,
                    }}
                />
            </View>
        </Touchable>
    );
}

const styles = StyleSheet.create({
    cameraWrapper: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'solid',
        overflow: 'hidden',
        borderColor: 'white',
    },
});
export default TakePhoto;