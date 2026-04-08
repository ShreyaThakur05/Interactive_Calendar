import WallCalendar from './components/WallCalendar';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px 60px',
    }}>
      <WallCalendar />
    </div>
  );
}
