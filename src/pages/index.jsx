import React, { useEffect } from 'react';
import { useGlobalState, useGlobalMutation } from '../utils/container';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import IndexCard from './index/card';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    width: '100%',
    minWidth: 200,
    minHeight: 100,
    boxSizing: 'content-box',
    display: 'flex',
    justifyContent: "center"
  }
}));

const Index = () => {
  const stateCtx = useGlobalState();
  const mutationCtx = useGlobalMutation();
  const classes = useStyles();

  useEffect(() => {
    if (stateCtx.loading === true) {
      mutationCtx.stopLoading();
    }
  }, [stateCtx.loading, mutationCtx]);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
      </div>
      <IndexCard />
    </Container>
  )
};

export default Index;
