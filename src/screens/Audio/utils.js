import { converTimeToSecond, getDisplayName } from '../../helpers/utils';

export const sortByIndexing = (a, b) => {
    return converTimeToSecond(a.start_time) - converTimeToSecond(b.start_time);
};

export const getBGImageURLWithClub = (item, club) => {
    if (item.photo_url && item.photo_url !== '') {
        return item.photo_url;
    } else {
        return club.voice_photo_url;
    }
};

export const getItemBackgroundImg = (item, club) => {
    let backgroundSource = '';
    if (item.audio_obj && item.audio_obj.photo_url !== '') {
        backgroundSource = getBGImageURLWithClub(item.audio_obj, club);
    } else {
        backgroundSource = getBGImageURLWithClub(item, club);
    }
    return backgroundSource;
};

export const getItemDescription = item => {
    let description = '';
    if (item.audio_obj && item.audio_obj.description !== '') {
        description = item.audio_obj.description;
    } else if (item.description !== '') {
        description = item.description;
    }
    return description;
};

export const getItemAudioURL = item => {
    let audio_url = '';
    if (item.audio_obj && item.audio_obj.audio_url !== '') {
        audio_url = item.audio_obj.audio_url;
    } else if (item.audio_url !== '') {
        audio_url = item.audio_url;
    }
    return audio_url;
};

export const getItemtId = item => {
    if (item.audio_id && item.audio_id !== '') {
        return item.audio_id;
    } else if (item.voicenote_id && item.voicenote_id !== '') {
        return item.voicenote_id;
    }
};

export const getItemTitle = item => {
    if (item.audio_obj && item.audio_obj.audio_name !== '') {
        return item.audio_obj.audio_name;
    } else if (item.audio_name !== '') {
        return item.audio_name;
    } else {
        return 'Message';
    }
};

export const getItemArtist = item => {
    if (!item.user) {
        return 'No Artist'
    }
    return getDisplayName(`${item.user.first_name}${item.user.last_name}`);
};

export const normalizeItem = (item, club) => {
    return {
        id: getItemtId(item),
        url: getItemAudioURL(item),
        title: getItemTitle(item),
        artist: getItemArtist(item),
        album: getItemDescription(item),
        artwork: getItemBackgroundImg(item, club),
    };
};
