import React, { useContext, useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';


import styles from './styles';
import MessageContext from '../MessageScreen/context';
import Navigation from '../../routers/navigation';
import {
    Container,
    SanityModal,
} from '../../components/index';

import Spinner from 'react-native-loading-spinner-overlay';

const colors = ['#131118', '#1f1b29', '#131118'];


const DeleteChannelListScreen = props => {
 
    const { chatClient } = useContext(MessageContext);
    const [channels, setChannels] = useState([]);
    const [selects, setSelects] = useState([]);
    const [show, setShow] = useState(false);
    const [mount, setMount] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!mount) {
            let mid_channels = props.navigation.state.params.channels;
            setChannels(mid_channels);
            setMount(true);
        }
    }, [mount]);

    const selectChannel = (channel) => {
        let mid_selects = [...selects];
        if (mid_selects.includes(channel.cid)) {
            mid_selects = mid_selects.filter(item => item != channel.cid);
        } else {
            mid_selects.push(channel.cid);
        }
        setSelects(mid_selects);
    }

    const deleteChannel = async() => {            
        setLoading(true);
        let rest_channels = channels;
        for (const item of selects) {
            const selectedChannel = channels.filter(e => e.cid === item)[0];
            rest_channels = rest_channels.filter(e => e.cid != item);                
            await selectedChannel.delete();
        }
        setChannels(rest_channels);
        setSelects([]);
        setTimeout(() =>{
            setLoading(false);
            setShow(false);
            Navigation.back();
        }, 3000);
    }

    const channelItem = (channel) => {
        const memberIds = Object.keys(channel.state.members);
        const otherUserId = memberIds[0] === chatClient?.user.id ? memberIds[1] : memberIds[0];
        return (
            <View>
                <TouchableOpacity onPress={()=>selectChannel(channel)}>
                    <View style={ styles.channelContainer }>
                        <View style={styles.selectContainer}>
                            <View style={ selects.includes(channel.cid) ? styles.selectOption : null}></View>
                        </View>
                        <View>
                            <Text style={styles.channelName}>{channel.state.members[otherUserId].user.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const handleNotifyModal = () => {
        if (show) setShow(false);
        else setShow(true);
    }

    return (
        <Container title="DELETE CHANNELS" isHome={true}>
            <SanityModal
                show={show}
                cancelText={`I'll stay`}
                hasClose={false}
                msg="Are you sure to delete the selected channels?"
                onCancel={handleNotifyModal}
                cancelText={`I'll stay`}
                hasClose={false}
                onConfirm={() => {
                    deleteChannel();
                }}
            />
            <Spinner visible={loading} />
            <View style={styles.absoluteFill}>
                <View>
                    <Text style={styles.description}>Select channels you want to delete</Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item)=> item.cid}
                        data={channels}
                        renderItem={({item}) => channelItem(item)}
                    />
                </View>
                <View style={styles.buttonLayout}>
                    <TouchableOpacity onPress={()=> selects.length > 0 ? setShow(true) : null }>
                        <View style={ selects.length > 0 ? styles.buttonContainer :styles.disableButtonContainer }>
                            <Text style={styles.button}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
};

export default DeleteChannelListScreen;
