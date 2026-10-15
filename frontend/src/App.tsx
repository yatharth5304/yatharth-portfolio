import { lazy, Suspense, useLayoutEffect, type PropsWithChildren } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
import { LoadingProvider } from "./context/LoadingProvider";

// Commit only after the route's lazy page is ready. On desktop the existing
// React loader then takes over; mobile reveals its content without extra delays.
const StartupReady = ({ children }: PropsWithChildren) => {
  useLayoutEffect(() => {
    document.getElementById("startup-loader")?.remove();
  }, []);
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoadingProvider>
              <Suspense>
                <StartupReady>
                  <MainContainer>
                    <Suspense>
                      <CharacterModel />
                    </Suspense>
                  </MainContainer>
                </StartupReady>
              </Suspense>
            </LoadingProvider>
          }
        />
        <Route
          path="/myworks"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <StartupReady>
                <MyWorks />
              </StartupReady>
            </Suspense>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
