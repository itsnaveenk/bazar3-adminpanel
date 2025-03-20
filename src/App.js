import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Results from './pages/Results';
import PrivateRoute from './utils/PrivateRoute';
import Layout from './components/Layout/Layout';
import AnimatedRoute from './components/AnimatedRoute';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={
          <AnimatedRoute>
            <Login />
          </AnimatedRoute>
        } />
        
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <AnimatedRoute>
                <Dashboard />
              </AnimatedRoute>
            } />
            <Route path="teams" element={
              <AnimatedRoute>
                <Teams />
              </AnimatedRoute>
            } />
            <Route path="results" element={
              <AnimatedRoute>
                <Results />
              </AnimatedRoute>
            } />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
