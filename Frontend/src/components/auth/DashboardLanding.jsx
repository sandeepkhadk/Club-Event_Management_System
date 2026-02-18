// src/components/DashboardLanding.jsx (adjust path based on your folder)
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// ✅ CORRECT IMPORT PATHS (adjust based on your folder structure)
import { useAuthContext } from '../../context/provider/AuthContext';  // If in src/components/
import { useUserRole } from '../../context/hooks/useUserRole';        // If in src/components/

const DashboardLanding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuthContext();
  const decoded = useUserRole();
  const user_id = decoded?.user_id;
  
  // ✅ FIX: Get clubId from URL params OR login data
  const clubId = searchParams.get('clubId') || '1';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!token || !user_id) {
        navigate('/clubs');
        return;
      }

      try {
        console.log(`🔍 Checking club ${clubId} for user ${user_id}`);
        
        const res = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/members/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const currentUser = data.members?.find(member => member.user_id == user_id);
          
          console.log('🎯 Role Check:', { user_id, clubId, currentUser });

          // ✅ IMMEDIATE REDIRECT - No state needed
          if (currentUser?.role === 'admin') {
            console.log('🎉 CLUB ADMIN →', `/club/${clubId}/admin`);
            navigate(`/club/${clubId}/admin`);
          } else {
            console.log('✅ MEMBER →', `/student/${clubId}`);
            navigate(`/student/${clubId}`);
          }
        } else {
          console.log('❌ Not member → /clubs');
          navigate('/clubs');
        }
      } catch (err) {
        console.error('❌ Role check failed:', err);
        navigate('/clubs');
      }
    };

    checkUserRole();
  }, [token, user_id, clubId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Loader2 className="text-white animate-spin" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Welcome Back!</h1>
        <p className="text-slate-500">Fetching your dashboard... (Club: {clubId})</p>
      </div>
    </div>
  );
};

export default DashboardLanding;
