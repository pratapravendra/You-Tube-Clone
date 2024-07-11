
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Typography, Box, Stack, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { fetchFromAPI } from './utils/fetchFromAPI';

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          setVideoDetail(data.items[0]);
        } else {
          console.error('No video found with the given ID');
        }
      })
      .catch((error) => {
        console.error('Error fetching video details:', error);
      });

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => {
        if (data && data.items) {
          setRelatedVideos(data.items);
        } else {
          console.error('No related videos found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching related videos:', error);
      });
  }, [id]);

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box flex={1}>
          <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
            {videoDetail ? (
              <>
                <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
                <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
                  {videoDetail.snippet.title}
                </Typography>
                <Stack direction="row" justifyContent="space-between" p={2}>
                  <Link to={`/channel/${videoDetail.snippet.channelId}`} style={{ textDecoration: 'none' }}>
                    <Typography color="#fff" variant="subtitle1">
                      {videoDetail.snippet.channelTitle}
                      <CheckCircle sx={{ fontSize: 16, color: 'gray', ml: '5px' }} />
                    </Typography>
                  </Link>
                  <Typography color="#aaa" variant="subtitle2">
                    {`${Number(videoDetail.statistics.viewCount).toLocaleString()} views`}
                  </Typography>
                </Stack>
              </>
            ) : (
              <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
                Loading video...
              </Typography>
            )}
          </Box>
        </Box>

        {/* Side Panel for Suggested Videos */}
        <Box width={{ xs: '100%', md: '30%' }} p={2} sx={{ bgcolor: '#333', borderRadius: '10px' }}>
          <Typography variant="h6" color="#fff" gutterBottom>
            Suggested Videos
          </Typography>
          <Stack spacing={2}>
            {relatedVideos.map((video) => (
              <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: '#444', // Dark background for the card
                    borderRadius: '10px', // Rounded corners
                  }}
                >
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    style={{ width: '120px', height: 'auto', borderRadius: '5px', marginRight: '10px' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" color="#fff" noWrap>
                      {video.snippet.title}
                    </Typography>
                    <Typography variant="subtitle2" color="gray">
                      {video.snippet.channelTitle}
                    </Typography>
                  </Box>
                </Paper>
              </Link>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;





