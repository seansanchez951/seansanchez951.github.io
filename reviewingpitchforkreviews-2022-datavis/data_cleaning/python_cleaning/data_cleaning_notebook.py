#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sqlite3
import plotly.express as px
import plotly
import math
import scipy.stats as stats


# In[2]:


connect = sqlite3.connect(r"C:\Users\seans\Desktop\CS 360 - Final Project\data.sqlite3")


# In[3]:


# get artists data
artists_query = '''
SELECT *
FROM artists
'''
artists_df = pd.read_sql_query(artists_query, connect)


# In[4]:


# get reviews data
reviews_query = '''
SELECT *
FROM reviews
'''
reviews_df = pd.read_sql_query(reviews_query, connect)


# In[5]:


# get scores data
scores_query = '''
SELECT *
FROM tombstones
'''
scores_df = pd.read_sql_query(scores_query, connect)


# In[6]:


# get genre data
genre_query = '''
SELECT *
FROM genre_review_map
'''
genre_df = pd.read_sql_query(genre_query, connect)


# In[7]:


# get artist map data
artist_map_query = '''
SELECT * 
FROM artist_review_map
'''

artist_mapdf = pd.read_sql_query(artist_map_query, connect)


# In[8]:


# get genre map data
genre_query = '''
SELECT * 
FROM genre_review_map
'''

genre_df = pd.read_sql_query(genre_query, connect)


# In[12]:


# create new data from queries

# need list of columns 
# 'name','artist_id' from artists_df
# 'review_url', 'pub_date' from reviews
# 'title' 'score' from scores_df

# when need to merge df's one by one to make sure the artists, title, and url all match up


# In[17]:


# start with artists datafram
merge_df = artists_df.copy()


# In[18]:


merge_df


# In[19]:


# merge artist_mapdf column based on artist_id
merge_df = merge_df.merge(artist_mapdf, on='artist_id')


# In[22]:


# merge scores_df columns based on review_id
merge_df = merge_df.merge(scores_df, on='review_url')


# In[24]:


# merge reviews_df columns based on review_url
merge_df = merge_df.merge(reviews_df, on='review_url')


# In[26]:


# merge genre_df columns based on review url
merge_df = merge_df.merge(genre_df, on='review_url')


# In[29]:


# drop columns we don't need
merge_df = merge_df.drop(columns=['picker_index','review_tombstone_id','body'])


# In[30]:


# reset index
merge_df =  merge_df.reset_index()


# In[33]:


# add new column year split from the pub_date column
merge_df['year'] = merge_df['pub_date'].str.split("-").str.get(0)


# In[35]:


# too reduce noise and provide better analysis of the data we'll remove music reviews on reissued albums
# shape of merged dataframe before removing data on music reviews for reissues is
# (28588, 13)
merge_df.shape


# In[36]:


merge_df = merge_df[merge_df['is_standard_review'] != 0]


# In[37]:


# after removing reissues
# (25266, 13)
merge_df.shape


# In[38]:


# get the average review score per year
avg_score_per_year = merge_df[['year','score']]


# In[40]:


# compute the mean score groupby year
avg_score_per_year = avg_score_per_year.groupby(avg_score_per_year.year).mean()
avg_score_per_year = avg_score_per_year.reset_index()


# In[43]:


# print out average score per year
avg_score_per_year.to_csv('pfk-avg-score-per-year.csv', header=True, index=False)


# In[44]:


# get the average review score per music genre
avg_score_per_genre = merge_df[['genre','score']]


# In[45]:


avg_score_per_genre = avg_score_per_genre.groupby(avg_score_per_genre.genre).mean()
avg_score_per_genre = avg_score_per_genre.reset_index()


# In[47]:


avg_score_per_genre.to_csv('genre-average-score.csv', header=True, index=False)


# In[55]:


# get all the review scores for each music genre over time
genre_trend_over_time = merge_df[['genre','score','pub_date','year']].copy()


# In[56]:


genre_trend_over_time['genre'].value_counts()


# In[57]:


# change music genre string 'Folk/County' to 'Folk_and_County'
# change music genre string 'Pop and R&B' to 'Pop_and_RnB'
# this is due to difficulties in the visualizing special character strings in d3

genre_trend_over_time['genre'] = genre_trend_over_time['genre'].apply(lambda x: 'Pop_and_RnB' if x == 'Pop/R&B' else x)
genre_trend_over_time['genre'] = genre_trend_over_time['genre'].apply(lambda x: 'Folk_and_Country' if x == 'Folk/Country' else x)


# In[58]:


genre_trend_over_time['genre'].value_counts()


# In[60]:


genre_trend_over_time.to_csv("genre-score-over-time.csv", header=True, index=False)


# In[61]:


# get the top 5 albums for each genre 
# will be used for tooltip information in the treemap visualisation 
top_rate_by_genre = (merge_df
                     .groupby(["genre", "name",'title','score','year'])
                     .mean()
                     .sort_values(["genre", "score"],
                                                ascending=False)
                     .groupby(level=0, as_index=False)
                     .apply(lambda x: x.head() if len(x) >= 10 else x.head(10))
                     .reset_index(level=0, drop=True)
                    ).round(2)


# In[62]:


top_rate_by_genre = top_rate_by_genre.reset_index()


# In[64]:


# remove columns we don't need for tooltip
top_rate_by_genre_final = top_rate_by_genre[['genre','name','title','year','score']].copy()


# In[65]:


# export top 5 albums by genre 
top_rate_by_genre_final.to_csv("top-five-albums.csv", header=True, index=False)

