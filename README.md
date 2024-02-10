# Persist state with Redux Persist using Redux Toolkit in React

![alt text](./public/image.png)

With the Redux Persist library, developers can save the Redux store in persistent storage, such as local storage. Therefore, even after refreshing the browser, the site state will be preserved. Redux Persist also includes methods that allow us to customize the state that gets persisted and rehydrated, all with an easily understandable API.

## Why use Redux Persist?

Redux Persist is a state management tool that allows the state in a Redux store to persist across browser and app sessions, improving user experience by pre-loading the store with persistent data. It also offers robustness against unexpected crashes and network issues, preventing data loss and offering a more reliable user experience.

Redux Persist offers various configurations, including custom caching strategies, deciding which parts of the state to persist and exclude, and the storage mechanism to use. It also comes with built-in features such as <code>migrations</code>,<code>transforms</code>, and <code>custom merges</code>.

Offline support is another advantage of persisting the Redux store in mobile applications. Persistent state allows users to interact with the app even when offline, and when the network connection is restored, the stored state is rehydrated.

Despite the absence of recent updates, Redux Persist has a large and active community with excellent documentation and readily available answers to common problems. It also works well with the Redux Toolkit, providing a more streamlined and effective state management experience.

## Persisting state with Redux Persist

First, we’ll add Redux Persist to our app with the following command:

```bash
npm i redux-persist
```

Next, we need to modify our store, which we’ll find in the redux folder in the src directory of the cloned app. Currently, our store looks like the code below:

```bash
// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: userReducer,
  devTools: process.env.NODE_ENV !== 'production',
})
```

We’ll make the following modifications to our store.js file to use Redux Persist:

```bash
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/user/userSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
```

In the code above, we replaced the value of the reducer property in the store from userReducer to persistedReducer, which is an enhanced reducer with configuration to persist the userReducer state to local storage. Aside from local storage, we can also use other storage engines like [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and [Redux Persist Cookie Storage Adapter.](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and

To use a different storage engine, we need to modify the value of the storage property of persistConfig with the storage engine we want to use. For example, to use the sessionStorage engine, we’ll first import it as follows:

```bash
import storageSession from 'redux-persist/lib/storage/session'
```

Then, modify persistConfig to look like the following code:

```bash
const persistConfig = {
  key: 'root',
  storageSession,
}
```

In the modification to the store above, we also included the middleware, which will intercept and stop non-serializable values in action before they get to the reducer. When using Redux Persist without using the middleware, we‘d get an error in the browser’s console reading a non-serializable value was detected in the state.

Finally, we passed our store as a parameter to persistStore, which is the function that persists and rehydrates the state. With this function, our store will be saved to the local storage, and even after a browser refresh, our data will remain.

In most use cases, we might want to delay the rendering of our app’s UI until the persisted data is available in the Redux store. For that, Redux Persist includes the PersistGate component. To use PersistGate, go to the index.js file in the src directory and add the following import:

```bash
// src/main.js
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
```

Now, modify the render function call to look like the code below:

```bash
// src/main.js
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
</Provider>
```

In this section, we covered the basic setup when using Redux Persist. Now, let’s explore the available options and use cases for Redux Persist.

NOTE the PersistGate loading prop can be null, or any react instance, e.g. loading={`<Loading />`}

## Advanced persistence techniques

Although Redux Persist offers a simple method for persisting the entire store, advanced techniques can be used to manage more complex persistence situations to enhance the robustness and flexibility of state persistence. The following are some of these persistence techniques.

### Nested persists using Redux Persist

If we have two or more reducers in Redux Toolkit, like userReducer and notesReducer, and we want to add them to our store, we’ll likely configure the store as follows:

```bash
const store = configureStore({
  reducer: {
    user: userReducer,
    notes: notesReducer
  },
})
```

We can also use combineReducers, which does the same thing:

```bash
const rootReducer = combineReducers({
  user: userReducer,
  notes: NotesReducer
})

const store = configureStore({
  reducer: rootReducer
})
```

To use Redux Persist in this case, we’ll supply rootReducer as a parameter of persistReducer, then replace rootReducer in our store with the persisted reducer as follows:

```bash
const rootReducer = combineReducers({
  user: userReducer,
  notes: NotesReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer
})
```

However, what if we want to set a different configuration? For example, let’s say we want to change the storage engine for userReducer to sessionStorage. To do so, we can use nested persists, a feature that allows us to nest persistReducer, giving us the ability to set different configurations for reducers.

Below is an example of a nested persist where I’m changing the storage of the userReducer to <code>sessionStorage</code>:

```bash
const rootPersistConfig = {
  key: 'root',
  storage,
}

const userPersistConfig = {
  key: 'user',
  storage: storageSession,
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  notes: notesReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer
})
```

NOTE: To clear localStorage with React Persist

```bash
import { persistor } from '../app/store';

persistor.purge().then(() => {
  console.log('Persisted state has been cleared.');
});
```
