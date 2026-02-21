#from django.shortcuts import render

# Create your views here.
import joblib
import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .serializers import PredictionSerializer, SignInSerializer, SignUpSerializer, UserSerializer
from django.contrib.auth import authenticate

from utils.utility import predict_sentiment

class PredictionView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PredictionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Load the model with scikit-learn version compatibility handling
                model_path = os.path.join(os.path.dirname(__file__), '../ml_models/dtmodel.pkl')
                if not os.path.exists(model_path):
                    return Response({
                        'error': 'Prediction model not found'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                try:
                    # Try standard joblib load first
                    model = joblib.load(model_path)
                except (ValueError, TypeError) as e:
                    error_str = str(e)
                    if 'incompatible dtype' in error_str or 'missing_go_to_left' in error_str:
                        # Handle scikit-learn version mismatch by patching the tree structure
                        try:
                            import pickle
                            import numpy as np
                            
                            # Load raw pickle
                            with open(model_path, 'rb') as f:
                                model = pickle.load(f)
                            
                            # Patch the tree structure if needed
                            if hasattr(model, 'tree_') and hasattr(model.tree_, 'nodes'):
                                try:
                                    # Check if nodes array needs patching
                                    nodes = model.tree_.nodes
                                    if nodes.dtype.names and 'missing_go_to_left' not in nodes.dtype.names:
                                        # Create new dtype with missing_go_to_left field
                                        old_dtype = nodes.dtype
                                        new_dtype = np.dtype([
                                            ('left_child', '<i8'),
                                            ('right_child', '<i8'),
                                            ('feature', '<i8'),
                                            ('threshold', '<f8'),
                                            ('impurity', '<f8'),
                                            ('n_node_samples', '<i8'),
                                            ('weighted_n_node_samples', '<f8'),
                                            ('missing_go_to_left', 'u1')
                                        ])
                                        
                                        # Create new array with compatible dtype
                                        new_nodes = np.zeros(nodes.shape, dtype=new_dtype)
                                        for field in old_dtype.names:
                                            new_nodes[field] = nodes[field]
                                        # Set default value for missing_go_to_left
                                        new_nodes['missing_go_to_left'] = 0
                                        
                                        # Replace the nodes array
                                        model.tree_.nodes = new_nodes
                                except Exception:
                                    pass  # If patching fails, try prediction anyway
                        except Exception as patch_error:
                            return Response({
                                'error': f'Model compatibility error: {str(e)}. The model was created with a different scikit-learn version. Please reinstall scikit-learn==1.2.2'
                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    else:
                        raise e

                # Extract and encode data
                data = [
                serializer.validated_data['question1'],
                serializer.validated_data['question2'],
                serializer.validated_data['question3'],
                serializer.validated_data['question4'],
                serializer.validated_data['question5'],
                serializer.validated_data['question6'],
                serializer.validated_data['question7'],
                serializer.validated_data['question8'],
                serializer.validated_data['question9'],
                serializer.validated_data['question10'],
                serializer.validated_data['question11'],
                serializer.validated_data['question12'],
                serializer.validated_data['question13'],
                serializer.validated_data['question14'],
                serializer.validated_data['question15'],
                serializer.validated_data['question16'],
                serializer.validated_data['question17'],
                serializer.validated_data['question18'],
                serializer.validated_data['question19'],
                ]

                # Encode categorical data (example encoding)
                encoding_question7 = {
                'R Programming': 0,
                'Information Security': 1,
                'Shell Programming': 2,
                'Machine Learning': 3,
                'Full Stack':4,
                'Hadoop':5,
                'Python':6,
                'Distro Making':7,
                'App Development':8

                }

                encoding_question8 = {
                'Database Security': 0,
                'System Designing': 1,
                'Web Technologies': 2,
                'Machine Learning': 3,
                'Hacking':4,
                'Testing':5,
                'Data Science':6,
                'Game Development':7,
                'Cloud Computing':8

                }


                encoded_data = [
                int(data[0]),  # Assuming question1 is already numeric
                int(data[1]),  # Assuming question2 is already numeric
                int(data[2]),  # Assuming question3 is already numeric
                int(data[3]),  # Assuming question4 is already numeric
                int(data[4]),  # Assuming question5 is already numeric
                int(data[5]),   # Assuming question6 is already numeric
                encoding_question7[data[6]],
                encoding_question8[data[7]],
                int(data[8]),  # Assuming question1 is already numeric
                int(data[9]),  # Assuming question2 is already numeric
                int(data[10]),  # Assuming question3 is already numeric
                int(data[11]),  # Assuming question4 is already numeric
                int(data[12]),  # Assuming question5 is already numeric
                int(data[13]),   # Assuming question6 is already numeric
                int(data[14]),  # Assuming question1 is already numeric
                int(data[15]),  # Assuming question2 is already numeric
                int(data[16]),  # Assuming question3 is already numeric
                int(data[17]),  # Assuming question4 is already numeric
                int(data[18]),  # Assuming question5 is already numeric
                ]

                # Make prediction
                prediction = model.predict([encoded_data])

                #Get the probability
                prediction_probability = model.predict_proba([encoded_data])

                # Get the probability of the predicted class
                predicted_class = int(prediction[0])
                predicted_proba = float(prediction_probability[0][predicted_class])

                return Response({
                    'prediction': predicted_class,
                    'probability': predicted_proba
                    }, status=status.HTTP_200_OK)
            except KeyError as e:
                return Response({
                    'error': f'Invalid option selected: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({
                    'error': f'Prediction failed: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
         serializer = SignUpSerializer(data=request.data)
         if(serializer.is_valid()):
             serializer.save()
             return Response({'success': True}, status=status.HTTP_201_CREATED)
         else:
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                return Response({'success': True, 'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailsView(APIView) :
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SentimentAnalysisView(APIView):
    def post(self, request, *args, **kwargs):
        try:

            if "text" in request.data:
                 
                  # Get the text input
                 text_input = request.data["text"]

                 predicted_sentiment = predict_sentiment(text_input)

                 return Response({"prediction": predicted_sentiment}, status=status.HTTP_200_OK)
            
            else:
                return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)