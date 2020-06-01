import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {useGlobalState, useGlobalMutation} from '../../utils/container';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useRouter from '../../utils/use-router';
import {Link} from 'react-router-dom';
import axios from 'axios';

const CustomRadio = withStyles({
  root: {
    color: '#999999',
    '&$checked': {
      color: '#44A2FC',
    },
    '&:hover': {
      backgroundColor: 'inherit',
    }
  },
})(({children, ...props}) => {
  return (
    <div className="role-item">
      <div className={`icon-${props.value}-${props.checked ? 'active' : 'inactive'}`}></div>
      <div className={`radio-row ${props.value}`}>
        <div className="custom-radio">
          <input type="radio" value={props.value} checked={props.checked} onChange={props.onChange} />
          <div className="checkmark"></div>
        </div>
        <Box flex="1" className={`role-name-${props.checked ? 'active' : 'inactive'}`}>{props.value}</Box>
      </div>
    </div>
  );
});

const useStyles = makeStyles(theme => ({
  fontStyle: {
    color: '#9ee2ff',
  },
  midItem: {
    marginTop: '1rem',
    marginBottom: '6rem',
  },
  item: {
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  coverLeft: {
    background: `linear-gradient(to bottom, #307AFF, 50%, #46cdff)`,
    alignItems: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  coverContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#fff',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    display: 'flex',
    minWidth: 700,
    minHeight: 500,
    maxHeight: 500,
    borderRadius: '10px',
    boxShadow: '0px 6px 18px 0px rgba(0,0,0,0.2)'
  },
  input: {
    maxWidth: '250px',
    minWidth: '250px',
    alignSelf: 'center',
  },
  grid: {
    margin: '0 !important',
  },
  button: {
    lineHeight: '21px',
    color:'rgba(255,255,255,1)',
    fontSize: '17px',
    textTransform: 'none',
    height: '44px',
    width: '260px',
    '&:hover': {
      backgroundColor: '#82C2FF',
    },
    margin: theme.spacing(1),
    marginTop: '33px',
    backgroundColor: '#44a2fc',
    borderRadius: '30px'
  },
  radio: {
    padding: '0',
    fontSize: '14px',
    // display: 'flex',
    alignItems: 'center',
    paddingRight: '5px',
  }
}));

export default function IndexCard () {
  const classes = useStyles();

  const routerCtx = useRouter();
  const stateCtx = useGlobalState();
  const mutationCtx = useGlobalMutation();
  const SERVER_URL = "http://127.0.0.1:8000/api/";
  let sessionToken = '';


  const fetchLiveSessionInfo = () => {

    axios.post(SERVER_URL + 'liveparticipants/verification', {'access_token': sessionToken, 'user_type': (stateCtx.config.host)? "host": "audience"})
        .then((resposne) => {
          if(resposne.status === 200){
            console.log(resposne.data);
            mutationCtx.updateConfig({channelName: resposne.data.channel_name})
            mutationCtx.startLoading();
            routerCtx.history.push({pathname: `/meeting/${stateCtx.config.channelName}`});
          } else{
            mutationCtx.toastError(`Invalid Credentials`)
          }

        });
  }

  const handleChange = (evt) => {
    const {value} = evt.target
    mutationCtx.updateConfig({
      host: value === 'host'
    });
  }

  return (
    <Box marginTop="114px" flex="1" display="flex" alignItems="center" justifyContent="flex-start" flexDirection="column">
      <Link to="/setting" className='setting-btn' />
      <div className="role-container">
        <CustomRadio
          className={classes.radio}
          value="host"
          checked={stateCtx.config.host}
          onChange={handleChange}
        >
        </CustomRadio>
        <CustomRadio
          className={classes.radio}
          value="audience"
          checked={!stateCtx.config.host}
          onChange={handleChange}
        >
        </CustomRadio>
      </div>
      <Box marginTop="92" flex="1" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <FormControl className={clsx(classes.input, classes.grid)}>
          <InputLabel htmlFor="accessToken">Please provide access token</InputLabel>
          <Input
            id="accessToken"
            name="accessToken"
            defaultValue={sessionToken}
            onChange={(evt) => {
              sessionToken = evt.target.value;
            }}/>
        </FormControl>
        <FormControl className={classes.grid}>
          <Button onClick={fetchLiveSessionInfo} variant="contained" color="primary" className={classes.button}>
            Start Live Class
          </Button>
        </FormControl>
      </Box>
    </Box>
  )
}
