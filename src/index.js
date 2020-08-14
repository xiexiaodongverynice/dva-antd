import 'babel-polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import './index.css';
import './assets/iconfont.css';
import './assets/icomoon.css';
// 1. Initialize
const app = dva({});

// 2. Plugins
app.use(createLoading());

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
