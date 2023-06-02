#!/usr/bin/python3
import mariadb
from mutagen.mp3 import MP3
import datetime
class myDatabase:
    def __init__(self):
        self.conn = mariadb.connect(
            user="isen",
            password="isen29",
            host="localhost",
            port=3306,
            database="music"
        )
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.conn.close()
    
    def dbQuery(self, query):
        try:
            self.cursor.execute(query)
        except mariadb.Error as e:
             return e
        self.conn.commit()
        return self.cursor
    
    def addTypeArtist(self, typeArtist):
        self.dbQuery(f"INSERT INTO type_artist(type_artist) VALUES('{typeArtist}')")
    
    def addArtist(self, nameArtist, typeArtist, img_path):
        self.dbQuery(f"INSERT INTO artist (name_artist, type_artist, img_path) VALUES('{nameArtist}', '{typeArtist}', '{img_path}')")
    
    def addTrack(self, name, artist, path, album):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{artist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{album}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"INSERT INTO tracks (name_tracks, duration, track_path, id_album, id_artist) VALUES('{name}', '{MP3(path).info.length}', '{path}', {id_album}, {id_artist})")


    def addAlbum(self, name, date_published, img_path, artist, style):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{artist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        self.dbQuery(f"INSERT INTO album(name_album, date_published, img_path, id_artist) VALUES('{name}', '{datetime.datetime(date_published[2], date_published[1], date_published[0]).strftime('%Y-%m-%d %H:%M:%S')}', '{img_path}', '{id_artist}')")
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{name}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"INSERT INTO is_style(style, id_album) VALUES('{style}', '{id_album}')")

    def addAlbumStyle(self, style):
        self.dbQuery(f"INSERT INTO album_style(style) VALUES('{style}')")

    def delTypeArtist(self, type_artist):
        self.dbQuery(f"DELETE FROM type_artist WHERE type_artist='{type_artist}'")
    
    def delAlbumStyle(self, style):
        idAlbumsWithStyle = self.dbQuery(f"SELECT id_album FROM is_style WHERE style='{style}'")
        result = idAlbumsWithStyle.fetchall()
        albumsWithStyle = []
        for i in range(len(result)):
            myQuery = self.dbQuery(f"SELECT name_album FROM album WHERE id_album={anIdAlbum[i][0]}")
            result = myQuery.fetchall()
            if result != []:
                albumsWithStyle.append(result[0][0])
        for album in albumsWithStyle:
            self.delAlbum(album)
        self.dbQuery(f"DELETE FROM is_style WHERE style='{style}'")
        self.dbQuery(f"DELETE FROM album_style WHERE style='{style}'")
        

    def delAlbum(self, nameAlbum, delTracks = False):
        myQuery = self.dbQuery(f"SELECT id_album FROM album WHERE name_album='{nameAlbum}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no album with this name")
            return
        id_album = result[0][0]
        self.dbQuery(f"DELETE FROM is_style WHERE id_album={id_album}")
        tracksInAlbum = self.dbQuery(f"SELECT name_tracks FROM tracks WHERE id_album={id_album}")
        result = myQuery.fetchall()
        for i in range(len(result)):
            self.delTrack(result[i][0])
        self.dbQuery(f"DELETE FROM album WHERE id_album={id_album}")
    
    def delArtist(self, nameArtist):
        myQuery = self.dbQuery(f"SELECT id_artist FROM artist WHERE name_artist='{nameArtist}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no artist with this name")
            return
        id_artist = result[0][0]
        myQuery = self.dbQuery(f"SELECT name_album FROM album WHERE id_artist={id_artist}")
        result = myQuery.fetchall()
        for i in range(len(result)):
            self.delAlbum(result[i][0])
        self.dbQuery(f"DELETE FROM artist WHERE id_artist={id_artist}")

    def delTrack(self, track):
        myQuery = self.dbQuery(f"SELECT id_tracks FROM tracks WHERE name_tracks='{track}'")
        result = myQuery.fetchall()
        if result == []:
            print("Error, no tracks with this name")
            return
        id_tracks= result[0][0]
        self.dbQuery(f"DELETE FROM favorites_tracks WHERE id_tracks={id_tracks}")
        self.dbQuery(f"DELETE FROM playlist_tracks WHERE id_tracks={id_tracks}")
        self.dbQuery(f"DELETE FROM tracks WHERE id_tracks={id_tracks}")

if __name__ == "__main__":
    myDb = myDatabase()
    myDb.delAlbum("2album")
