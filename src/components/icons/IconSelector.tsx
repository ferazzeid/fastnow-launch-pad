
import React from 'react';
import { 
  SpeedIcon, 
  SecurityIcon, 
  IntuitiveIcon 
} from './FeatureIcons';
import { 
  Clock, 
  Lock, 
  Leaf, 
  Heart, 
  Activity, 
  Smartphone, 
  BarChart, 
  Calendar, 
  Timer
} from 'lucide-react';

// Extend the available icons with Lucide icons
export const Icons = {
  // Original icons
  SpeedIcon: (props: { className?: string }) => <SpeedIcon {...props} />,
  SecurityIcon: (props: { className?: string }) => <SecurityIcon {...props} />,
  IntuitiveIcon: (props: { className?: string }) => <IntuitiveIcon {...props} />,

  // Fasting-specific icons from Lucide
  ClockIcon: (props: { className?: string }) => <Clock className={props.className} />,
  LockIcon: (props: { className?: string }) => <Lock className={props.className} />,
  LeafIcon: (props: { className?: string }) => <Leaf className={props.className} />,
  HeartIcon: (props: { className?: string }) => <Heart className={props.className} />,
  ActivityIcon: (props: { className?: string }) => <Activity className={props.className} />,
  SmartphoneIcon: (props: { className?: string }) => <Smartphone className={props.className} />,
  BarChartIcon: (props: { className?: string }) => <BarChart className={props.className} />,
  CalendarIcon: (props: { className?: string }) => <Calendar className={props.className} />,
  TimerIcon: (props: { className?: string }) => <Timer className={props.className} />,
};

export default Icons;
