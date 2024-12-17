import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '@/styles/globalStyles'
import { colors } from '@/styles/colors'

const Loading = (props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<ActivityIndicator> & Readonly<ActivityIndicatorProps>) => {
  return (
    <View style={[globalStyles.container, { justifyContent: "center" }]}>
      <ActivityIndicator style={{ height: "auto" }} {...props} color={colors.primary}/>
    </View>
  )
}

export default Loading