var ckconfig = {
  dbs_url: 'https://dashboard-sandbox.firebaseio.com/dashboards',
  wdg_url: 'https://dashboard-sandbox.firebaseio.com/dashboards/widgets',
  dat_url: 'https://vpc.firebaseio.com/dashboard',
  log_url: 'https://vpc.firebaseio.com/dashboard',
};
ckconfig.dbs_fb = new Firebase(ckconfig.dbs_url);
ckconfig.wdg_fb = new Firebase(ckconfig.wdg_url);
ckconfig.dat_fb = new Firebase(ckconfig.dat_url);
ckconfig.log_fb = new Firebase(ckconfig.log_url);

