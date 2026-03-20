import * as React from "react";

export function CloudBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated cloud-like gradients */}
      <div className="absolute inset-0">
        {/* Cloud 1 - Blue gradient */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #1C60FF 0%, transparent 70%)',
            top: '10%',
            left: '15%',
            animation: 'morph1 8s ease-in-out infinite, float1 6s ease-in-out infinite'
          }}
        />
        
        {/* Cloud 2 - Peach gradient */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #EA827A 0%, transparent 70%)',
            top: '60%',
            right: '20%',
            animation: 'morph2 10s ease-in-out infinite, float2 7s ease-in-out infinite'
          }}
        />
        
        {/* Cloud 3 - Purple gradient */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #D0BBEB 0%, transparent 70%)',
            bottom: '10%',
            left: '25%',
            animation: 'morph3 9s ease-in-out infinite, float3 8s ease-in-out infinite'
          }}
        />
        
        {/* Cloud 4 - Light blue gradient */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #3C8AFF 0%, transparent 70%)',
            top: '40%',
            right: '10%',
            animation: 'morph4 7s ease-in-out infinite, float4 5s ease-in-out infinite'
          }}
        />
        
        {/* Cloud 5 - Dark blue gradient */}
        <div 
          className="absolute w-[650px] h-[650px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #0D1EBB 0%, transparent 70%)',
            top: '25%',
            left: '50%',
            animation: 'morph5 11s ease-in-out infinite, float5 9s ease-in-out infinite'
          }}
        />
      </div>

      <style>{`
        @keyframes morph1 {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: scale(1);
          }
          50% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: scale(1.1);
          }
        }
        
        @keyframes morph2 {
          0%, 100% { 
            border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
            transform: scale(1);
          }
          50% { 
            border-radius: 70% 30% 40% 60% / 40% 70% 30% 60%;
            transform: scale(1.15);
          }
        }
        
        @keyframes morph3 {
          0%, 100% { 
            border-radius: 50% 50% 40% 60% / 55% 45% 55% 45%;
            transform: scale(1);
          }
          50% { 
            border-radius: 45% 55% 60% 40% / 60% 40% 60% 40%;
            transform: scale(1.08);
          }
        }
        
        @keyframes morph4 {
          0%, 100% { 
            border-radius: 65% 35% 50% 50% / 50% 65% 35% 50%;
            transform: scale(1);
          }
          50% { 
            border-radius: 35% 65% 50% 50% / 65% 35% 65% 35%;
            transform: scale(1.12);
          }
        }
        
        @keyframes morph5 {
          0%, 100% { 
            border-radius: 55% 45% 45% 55% / 60% 40% 60% 40%;
            transform: scale(1);
          }
          50% { 
            border-radius: 45% 55% 55% 45% / 40% 60% 40% 60%;
            transform: scale(1.05);
          }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -20px); }
          66% { transform: translate(-20px, 30px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-30px, 20px); }
          66% { transform: translate(20px, -30px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, 30px); }
          66% { transform: translate(-30px, -20px); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-20px, -30px); }
          66% { transform: translate(30px, 20px); }
        }
        
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(25px, -25px); }
          66% { transform: translate(-25px, 25px); }
        }
      `}</style>
    </div>
  );
}