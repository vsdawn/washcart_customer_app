import { Alert, AppRegistry } from 'react-native';
import App from './App';
import pkg from './package.json';

const appName = pkg.name;

// react-native-web's Alert.alert is a no-op; fall back to the browser dialogs
/* eslint-disable no-alert */
Alert.alert = (title, message, buttons) => {
  const text = [title, message].filter(Boolean).join('\n\n');
  if (!buttons || buttons.length === 0) {
    window.alert(text);
    return;
  }
  if (buttons.length === 1) {
    window.alert(text);
    buttons[0].onPress?.();
    return;
  }
  const cancel = buttons.find(b => b.style === 'cancel');
  const confirm = buttons.find(b => b !== cancel) ?? buttons[buttons.length - 1];
  if (window.confirm(text)) {
    confirm.onPress?.();
  } else {
    cancel?.onPress?.();
  }
};

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
