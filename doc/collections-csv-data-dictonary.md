Collection CSV List Data Dictionary
===================================

A Media Cloud collection CSV list is s spreadsheet that lists all the data we have about sources in a specific collection. We support downloading and uploading this content. Below is a list of all the fields in this CSV, and whether they support being uploaded.

## media_id

This is an internal unique id for every source.  If you are uploading content then do not fill this in.

## url

This is the base url of the media source. If uploading, this is the most important piece of information to add in.  We will check this website to discover any and all RSS feeds we can then use to import stories regularly.

## name

This is the human name of the source.  In general we pull this from the title of the homepage of this source, so if you are uploading you do not need to fill it in.

## pub_country

This is the country the source is published in. This is encoded based on the ["alpha3" ISO-3166-1 standard](https://en.wikipedia.org/wiki/ISO_3166-1). If you are uploading this data, please be sure to check that list and put the 3-letter code for the country in all-caps in this column.

## pub_state

This indicates the state the source is published in. Values in this column are based on the [ISO 3166-2 standard](https://en.wikipedia.org/wiki/ISO_3166-2).  For instance, the code for the subdivision of "Corse" in FRance should be entered as "FR-COR". You can upload this data by specifying it in that format.

## primary_language

This is the main language the source publishes in.  This is algorithmically determined by our language detection system.  If this column is empty, or says "none", that means we do not have enough stories to make a good judgement about the primary language. If uploading data, you should leave this empty, because it is algorithmically determined.


## subject_country

This is the main county stories from this source are about.  This is algorithmically determined by our geo-parsing and geo-location engine. Countries are represented by their ["alpha3" ISO-3166-1 standard](https://en.wikipedia.org/wiki/ISO_3166-1).  If this column is empty, or says "none", that means we do not have enough stories to make a good judgement. If uploading data, you should leave this empty, because it is algorithmically determined.

## media_type

This indicates what type of media source this is.  This is a fixed taxonomy of sources we created in collaboration with the Media Cloud community. The values are:
 * print_native: This source is primarily a print publication. Use this for newspapers and magazines. Examples: New York Times, The Economist.
 * digital_native: This source is internet based. Use this for news sources that began on the internet first, organizational websites, and blogs. Examples: CDC, Vox, Scroll.in.
 * video_broadcast: This source is primarily a broadcast TV station (ie. video transcriptions or closed captions). Examples: CNN, FoxNews.
 * audio_broadcast: This source is primarily a broadcast radio station or podcast (ie. audio transcriptions). Examples: NPR.
 * other: This source doesn't fit in any of the other categories. Examples: AP, Reuters.

## public_notes

These are any public notes we have made about this source and why we added it.
